# 🛡️ Sentinel Docs: Security-Hardened RAG for Sensitive Data

**[🚀 Live Demo Coming Soon](#)** | **[📂 View Codebase](https://github.com/GeorgiDS9/sentinel-docs)**

**Defensive AI Engineering | Automated Redaction | Next.js 15**

Sentinel Docs is an enterprise-grade **Security Vault** for document intelligence. Built as a "Zero-Trust" evolution of the RAG pipeline, it focuses on **PII (Personally Identifiable Information) Redaction** and **Adversarial Prompt Guardrails**, ensuring that sensitive data is sanitized before it ever reaches the LLM.

---

## 🚀 Upcoming Security Features

- **Automated PII Redaction:** In-flight scanning and masking of Names, Emails, and Phone Numbers before data reaches the vector store.
- **Adversarial Prompt Guardrails:** Built-in "Firewall" to detect and block prompt injection attacks (e.g., "Ignore previous instructions").
- **Encrypted Session Isolation:** Ensuring document context is strictly isolated to the browser session and never persisted in raw form.
- **Evidence-First Verification:** Retaining "Source Pills" to allow for human auditability of AI responses.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Shadcn/UI (**Obsidian Security Theme**)
- **Security Middleware:** Regex-based & NER Redaction Engines
- **AI Orchestration:** LangChain.js & Vercel AI SDK
- **LLM & Embeddings:** OpenAI `gpt-4o-mini` & `text-embedding-3-small`
- **Vector Storage:** `MemoryVectorStore` (Cosine Similarity Search)

---

## 🏗️ Technical Foundation (Proven Wins)

_This project inherits the hardened architectural foundations of the DocuMind core:_

1.  **DOMMatrix Environment Patching:** Decoupled server-side text extraction to bypass browser-native rendering crashes in Node.js.
2.  **Streaming Protocol Alignment:** Utilizes `x-vercel-ai-data-stream` to manage high-latency AI generations in serverless environments.
3.  **Recursive Character Chunking:** Semantic "Subway Slicing" logic to maintain context across 1000-character windows.

---

## 🧪 The "Sentinel" Challenge (Work in Progress)

I am currently engineering the **Redaction Interceptor**. The goal is to prove that a user can upload a sensitive contract, and the AI will only "see" and "recall" the sanitized version, protecting user privacy by design.

---

## 🚦 Getting Started

1.  **Clone & Install:**
    ```bash
    npm install
    ```
2.  **Environment Setup:**
    Create a `.env.local` in the root and add your OpenAI key:
    ```bash
    OPENAI_API_KEY=sk-proj-xxxx...
    ```
3.  **Run Development:**
    ```bash
    npm run dev
    ```

---

### **Engineering Philosophy**

Drawing on nearly 5 years of cybersecurity experience at **Trend Micro**, I am building Sentinel Docs to prove that AI doesn't have to be a "Data Leak" risk. It demonstrates my ability to build **Defensive AI systems** that prioritize **Privacy**, **Safety**, and **Traceability**.
