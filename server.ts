import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory cache for breaking news (30 minutes expiry)
interface NewsCache {
  items: string[];
  lastUpdated: number; // timestamp ms
}

let newsCache: NewsCache = {
  items: [
    "ASAE SUMMIT 2026: Cape Town V&A Waterfront venue finalized for bilateral SADC trade and investment summits.",
    "ANGOLA-SA ACCORD: Sovereign energy partnerships unlocked to upgrade regional transport corridors.",
    "SOUTH AFRICA FINTECH: Reserve Bank records surge in high-velocity digital trade transactions and automated settlement channels.",
    "SADC GROWTH SPOTLIGHT: Real-time agricultural intelligence indices indicate 4.8% GDP acceleration across regional states.",
    "VIP NOMINATIONS: Final audit validates over 48,150 voter logs and secure board delegate review slots."
  ],
  lastUpdated: 0 // forces initial load
};

const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to default news items.");
      return null;
    }
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return geminiClient;
}

// REST API for breaking news
app.get("/api/breaking-news", async (req, res) => {
  const now = Date.now();
  const cacheAge = now - newsCache.lastUpdated;

  // Return cached version if still valid
  if (cacheAge < CACHE_EXPIRY_MS && newsCache.lastUpdated > 0) {
    return res.json({
      items: newsCache.items,
      source: "cache",
      nextUpdateInMs: CACHE_EXPIRY_MS - cacheAge
    });
  }

  // Attempt to fetch fresh news using Gemini with Search Grounding
  const client = getGeminiClient();
  if (!client) {
    // Graceful fallback if no key
    return res.json({
      items: newsCache.items,
      source: "fallback-no-key",
      nextUpdateInMs: CACHE_EXPIRY_MS
    });
  }

  let itemsGot: string[] | null = null;
  let successSource = "gemini-api";

  // Tier 1: Gemini Call with Grounded Google Search (if quota permits)
  try {
    console.log("Tier 1: Fetching fresh breaking news from Gemini Grounded Search API...");
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Search for real, actual global business, corporate mergers, SADC investment, or African economic leadership breaking news from recent weeks of 2026. Generate exactly 5 highly compelling, professional, real-time breaking news bulletin list items.",
      config: {
        systemInstruction: "You are a premium breaking news agency intelligence system for ASAE. Generate exactly 5 short, impactful breaking news items under 22 words each. Ensure the news is realistic or retrieved via search grounding. Format as a pure JSON array of strings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        },
        tools: [
          { googleSearch: {} }
        ]
      }
    });

    if (response.text) {
      const parsedItems = JSON.parse(response.text.trim()) as string[];
      if (Array.isArray(parsedItems) && parsedItems.length > 0) {
        itemsGot = parsedItems;
        successSource = "gemini-api-search";
      }
    }
  } catch (searchError: any) {
    const errMsg = searchError?.message || String(searchError);
    // Suppress heavy stack print to prevent false telemetry alarms on expected rate-limits
    console.log(`Tier 1 Info: Search Grounding not available right now (${searchError?.status || "429/Overloaded"}). Transitioning safely to Tier 2...`);
  }

  // Tier 2: Gemini Call WITHOUT Grounded Search (Consumes standard tier quota, avoiding search limits)
  if (!itemsGot) {
    try {
      console.log("Tier 2: Fetching standard breaking news from Gemini (Without Google Search)...");
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Generate exactly 5 highly compelling, professional, realistic breaking news bulletin list items representing actual global corporate mergers, SADC investments, and African business leaders hubs for the current year. Keep items distinct and realistic.",
        config: {
          systemInstruction: "You are a premium breaking news agency intelligence system for ASAE. Generate exactly 5 short, impactful breaking news items under 22 words each. Ensure the news is realistic and highly professional. Format as a pure JSON array of strings.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING
            }
          }
        }
      });

      if (response.text) {
        const parsedItems = JSON.parse(response.text.trim()) as string[];
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          itemsGot = parsedItems;
          successSource = "gemini-api-standard";
        }
      }
    } catch (stdError: any) {
      // Suppress raw dump to avoid error alarms, fall back cleanly
      console.log(`Tier 2 Info: Standard model generation exhausted/overloaded (${stdError?.status || "503/Limit"}). Seamlessly applying Tier 3 local publisher pool...`);
    }
  }

  // Tier 3: Hard Fallback to Dynamic SADC/Global Business news generator pool
  if (!itemsGot) {
    itemsGot = [
      "ASAE SUMMIT: Cape Town V&A Waterfront venue finalized for bilateral SADC trade and investment assemblies.",
      "ANGOLA-SA ACCORD: Sovereign energy partnerships unlocked to upgrade regional transport corridors.",
      "FINTECH SURGE: Central banks record rapid growth in multi-currency settlement channels across SADC borders.",
      "AGRICULTURE FOCUS: Real-time intelligence platforms report notable yield increases across regional agricultural cooperatives.",
      "BOARD DIRECTIVE: Final audit seals secure nominee delegate review registers for upcoming plenary sessions.",
      "MERGER SPOTLIGHT: Prominent Southern African telecommunications group announces infrastructure expansion in Western SADC corridors.",
      "RENEWABLE VENTURE: Multi-million dollar wind-facility projects approved for development in coastal sectors.",
      "YOUTH SKILLS: Regional leadership initiative commits further fund allocation to digital training and technology hubs.",
      "DIGITAL BORDER COOPERATION: Seamless digital customs clearance systems successfully piloted across regional checkpoints."
    ].sort(() => 0.5 - Math.random()).slice(0, 5);

    successSource = "fallback-local-simulator";
  }

  // Update Cache regardless of which tier succeeded so we respect the 30-minute interval and don't spam the API on rate limits
  newsCache = {
    items: itemsGot.map(item => item.startsWith("✦") ? item : `✦ ${item}`),
    lastUpdated: now
  };

  console.log(`[Breaking News Cache Updated] Source: ${successSource}`);
  return res.json({
    items: newsCache.items,
    source: successSource,
    nextUpdateInMs: CACHE_EXPIRY_MS
  });
});

// Vite middleware or static files setup
async function setupApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

setupApp();
