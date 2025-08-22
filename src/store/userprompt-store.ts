import { create } from "zustand";

export interface AnalysisState {
  fromToken: string;
  toToken: string;
  amount: string;
  data: {
    dex: any;
    prices: any;
  } | null;
  prompts: {
    system: string;
    user: string;
  } | null;
  analysis: {
    raw: string;
    parsed?: any;
  } | null;
  loading: boolean;
  error: string | null;
  metadata: any | null;
  setInput: (fromToken: string, toToken: string, amount: string) => void;
  runAnalysis: () => Promise<void>;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  fromToken: "USDC",
  toToken: "ETH",
  amount: "0",
  data: null,
  prompts: null,
  analysis: null,
  loading: false,
  error: null,
  metadata: null,
  setInput: (fromToken, toToken, amount) => set({ fromToken, toToken, amount }),
  runAnalysis: async () => {
    const { fromToken, toToken, amount } = get();
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromToken, toToken, amount }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();

      const analysis = json.ai
        ? {
            raw: json.ai.raw || "",
            parsed: json.ai.parsed || null,
          }
        : null;

      set({
        data: json.data,
        prompts: json.prompts,
        analysis: analysis,
        metadata: json.metadata,
        loading: false,
      });
    } catch (e: any) {
      set({ error: e?.message || "Unknown error", loading: false });
    }
  },
}));
