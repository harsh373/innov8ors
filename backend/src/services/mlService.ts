import axios from "axios";

const ML_BASE_URL = process.env.ML_URL as string;

if (!ML_BASE_URL) {
  throw new Error("ML_URL not defined in environment variables");
}

export interface MLResponse {
  mandi_benchmark: number;
  expected_price: number;
  is_anomaly: boolean;
  reason: string;
  deviation: string;
}

const mlClient = axios.create({
  baseURL: ML_BASE_URL,
  timeout: 60000,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const checkPriceWithML = async (payload: {
  month: number;
  commodity_name: string;
  market_name: string;
  actual_price: number;
}, retries = 3): Promise<MLResponse> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await mlClient.post('/api/v1/check-price', payload);
      return response.data;
    } catch (error: any) {
      const isLastAttempt = attempt === retries;
      const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
      const isServerError = error.response?.status >= 500;

      if (isLastAttempt || (!isTimeout && !isServerError)) {
        throw error;
      }

      console.log(`ML service attempt ${attempt} failed, retrying in ${attempt * 2}s...`);
      await sleep(attempt * 2000);
    }
  }

  throw new Error('ML service unavailable after retries');
};

export const pingMLService = async (): Promise<boolean> => {
  try {
    await mlClient.get('/health', { timeout: 10000 });
    return true;
  } catch {
    return false;
  }
};