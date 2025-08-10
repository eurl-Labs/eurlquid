// src/types/groq.ts
export interface GroqLiquidityOracleResponse {
  prediction: {
    timeframe: string;
    liquidityChange: number;
    riskScore: number;
    confidence: number;
  };
  advice: string;
  expectedSlippage: string;
  expectedSavingsUSD: number;
  optimalRoute: Array<{
    dex: string;
    allocation: number;
    status: string;
  }>;
  riskAlerts: string[];
  explanation: {
    liquidityPredictionReason: string;
    riskAssessmentReason: string;
    routeRecommendationReason: string;
  };
}
