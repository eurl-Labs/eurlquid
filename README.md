# 🌊 eurlquid Frontend

eurlquid is a **real-time cross-DEX liquidity intelligence frontend**.  
It provides an **AI-powered interface** to:

- 🔄 Swap tokens with predictive insights  
- 💧 Create and manage liquidity pools  
- ➕ Add liquidity safely  
- 📊 Explore DEX performance and rankings  

Currently supports: **Sonic Network** + DEX aggregators **Uniswap, 1inch, Curve, Balancer**.  

---

## 🔧 Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) **v18 or later**  
- [pnpm](https://pnpm.io/) **v8+** → `npm i -g pnpm`  
- [Git](https://git-scm.com/)  

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
# Clone repo
git clone https://github.com/eurl-Labs/eurlquid.git
cd eurlquid

# Install dependencies
pnpm install

# Run development server
pnpm dev


Create a .env file in the project root.
You can copy the template below:

# .env.example

NEXT_PUBLIC_GRAPHQL_ENDPOINT=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# Groq (AI LLM API)
GROQ_API_KEY=
GROQ_API_URL=

# Alchemy (RPC & WebSocket Endpoints)
ALCHEMY_API_KEY=
ALCHEMY_HTTP_ETHEREUM=
ALCHEMY_WS_BASE=

# The Graph
THEGRAPH_API_KEY=

pnpm dev       # Run dev server (hot reload)
pnpm build     # Build production
pnpm start     # Start production build
pnpm lint      # Run linter

📄 License

This project is licensed under the MIT License
