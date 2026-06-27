import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if keys are actually configured and aren't placeholders
export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set. The application is falling back to localStorage mode.'
  );
}

// Utility helper to map DB columns (handling both snake_case from DB and camelCase from original frontend models)
function mapKeys(obj: any, toCamel = true) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => mapKeys(item, toCamel));

  const result: any = {};
  for (const key of Object.keys(obj)) {
    let newKey = key;
    if (toCamel) {
      // snake_case to camelCase
      newKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
      // Special mappings
      if (key === 'vote_id') newKey = 'voteId';
      if (key === 'voter_id') newKey = 'voterId';
      if (key === 'device_id') newKey = 'deviceId';
      if (key === 'payment_ref') newKey = 'paymentRef';
      if (key === 'nominee_name') newKey = 'nomineeName';
      if (key === 'category_name') newKey = 'categoryName';
      if (key === 'risk_score') newKey = 'riskScore';
      if (key === 'photo_url') newKey = 'photoUrl';
      if (key === 'gallery_count') newKey = 'galleryCount';
      if (key === 'video_url') newKey = 'videoUrl';
      if (key === 'website_url') newKey = 'websiteUrl';
      if (key === 'votes_count') newKey = 'votesCount';
      if (key === 'judges_score') newKey = 'judgesScore';
      if (key === 'voter_email') newKey = 'voterEmail';
      if (key === 'ip_address') newKey = 'ipAddress';
      if (key === 'device_fingerprint') newKey = 'deviceFingerprint';
      if (key === 'anomaly_type') newKey = 'anomalyType';
      if (key === 'created_at') newKey = 'createdAt';
      if (key === 'budget_limit') newKey = 'budgetLimit';
      if (key === 'budget_spent') newKey = 'budgetSpent';
      if (key === 'image_url') newKey = 'imageUrl';
      if (key === 'pass_type') newKey = 'passType';
      if (key === 'amount_zar') newKey = 'amountZar';
      if (key === 'amount_aoa') newKey = 'amountAoa';
      if (key === 'payment_method') newKey = 'paymentMethod';
      if (key === 'nominee_email') newKey = 'nomineeEmail';
      if (key === 'nominee_bio') newKey = 'nomineeBio';
      if (key === 'nominator_name') newKey = 'nominatorName';
      if (key === 'nominator_email') newKey = 'nominatorEmail';
      if (key === 'submission_letter') newKey = 'submissionLetter';
      if (key === 'attachment_name') newKey = 'attachmentName';
    } else {
      // camelCase to snake_case
      newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    }
    result[newKey] = mapKeys(obj[key], toCamel);
  }
  return result;
}

// Gentle error handler to prevent crashing or heavy error logs if tables aren't yet created
function handleSupabaseError(action: string, err: any) {
  const errMsg = err?.message || String(err);
  const isTableMissing = err?.code === '42P01' || errMsg.includes('relation') || errMsg.includes('does not exist') || errMsg.includes('not found');
  if (isTableMissing) {
    console.info(`[Supabase Connection Info] Table not yet available during "${action}": ${errMsg}. Seamlessly falling back to local simulation data.`);
  } else {
    console.warn(`[Supabase Connection Warning] Action "${action}" encountered error: ${errMsg}`);
  }
}

// --- TABLE: blogs ---
export async function getSupabaseBlogs(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return mapKeys(data, true);
  } catch (err) {
    handleSupabaseError('fetching blogs', err);
    return null;
  }
}

export async function saveSupabaseBlog(blog: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload = mapKeys(blog, false);
    const { error } = await supabase.from('blogs').upsert(dbPayload);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError('saving blog', err);
    return false;
  }
}

// --- TABLE: ads ---
export async function getSupabaseAds(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    return mapKeys(data, true);
  } catch (err) {
    handleSupabaseError('fetching ads', err);
    return null;
  }
}

export async function saveSupabaseAd(ad: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload = mapKeys(ad, false);
    const { error } = await supabase.from('ads').upsert(dbPayload);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError('saving ad', err);
    return false;
  }
}

// --- TABLE: asae_transactions ---
export async function getSupabaseTransactions(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('asae_transactions')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return mapKeys(data, true);
  } catch (err) {
    handleSupabaseError('fetching transactions', err);
    return null;
  }
}

export async function saveSupabaseTransaction(txn: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload = mapKeys(txn, false);
    const { error } = await supabase.from('asae_transactions').upsert(dbPayload);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError('saving transaction', err);
    return false;
  }
}

// --- TABLE: asae_nominations ---
export async function getSupabaseNominations(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('asae_nominations')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return mapKeys(data, true);
  } catch (err) {
    handleSupabaseError('fetching nominations', err);
    return null;
  }
}

export async function saveSupabaseNomination(nom: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload = mapKeys(nom, false);
    const { error } = await supabase.from('asae_nominations').upsert(dbPayload);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError('saving nomination', err);
    return false;
  }
}

// --- TABLE: asae_voting_nominees ---
export async function getSupabaseVotingNominees(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('asae_voting_nominees')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    return mapKeys(data, true);
  } catch (err) {
    handleSupabaseError('fetching voting nominees', err);
    return null;
  }
}

export async function saveSupabaseVotingNominee(nominee: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload = mapKeys(nominee, false);
    const { error } = await supabase.from('asae_voting_nominees').upsert(dbPayload);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError('saving voting nominee', err);
    return false;
  }
}

// --- TABLE: asae_voting_fraud_alerts ---
export async function getSupabaseFraudAlerts(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('asae_voting_fraud_alerts')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return mapKeys(data, true);
  } catch (err) {
    handleSupabaseError('fetching fraud alerts', err);
    return null;
  }
}

export async function saveSupabaseFraudAlert(alert: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload = mapKeys(alert, false);
    const { error } = await supabase.from('asae_voting_fraud_alerts').upsert(dbPayload);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError('saving fraud alert', err);
    return false;
  }
}

// --- TABLE: asae_vote_audits ---
export async function getSupabaseVoteAudits(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('asae_vote_audits')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return mapKeys(data, true);
  } catch (err) {
    handleSupabaseError('fetching vote audits', err);
    return null;
  }
}

export async function saveSupabaseVoteAudit(audit: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload = mapKeys(audit, false);
    const { error } = await supabase.from('asae_vote_audits').upsert(dbPayload);
    if (error) throw error;
    return true;
  } catch (err) {
    handleSupabaseError('saving vote audit', err);
    return false;
  }
}
