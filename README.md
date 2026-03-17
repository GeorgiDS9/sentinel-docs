# 🛡️ Sentinel Docs: Security-Hardened RAG for Sensitive Data

**[🚀 Live Demo Coming Soon](#)** | **[📂 View Codebase](https://github.com/GeorgiDS9/sentinel-docs)**

**Defensive AI Engineering | Automated PII Redaction | Next.js 15 | Upstash Vector**

Sentinel Docs is an enterprise-grade **Security Vault** for document intelligence. Built as a "Zero-Trust" evolution of the RAG pipeline, it implements a defensive ingestion layer that sanitizes sensitive data before it ever reaches the vector store or the LLM.

---

## 🛡️ Core Security Architecture

**Automated PII Redaction:** In-flight Regex-based sanitization engine that masks Emails, Phone Numbers, Credit Cards, and SSNs _before_ data is vectorized.

- **Real-Time Security Auditing (v1):** A "Security Shield" handshake (UI toast) that provides users with immediate feedback via granular "Redaction Reports" (PII counts) upon document ingestion.
- **Sentinel Guard Dashboard (v2):** A persistent "Command Center" UI (mini-dashboard card) that aggregates session-wide audit metrics into a permanent monitor, surviving browser refreshes.
- **Persistent Cloud Memory:** Integrated **Upstash Vector** (1536d / Cosine) for session-isolated storage, curing the "Amnesia" bug by persisting sanitized context to the cloud.
- **Defensive Guardrails:** Hardened AI instructions using **Markdown Header Isolation** to detect and block indirect prompt injection attacks.
- **Zero-Trust Grounding:** Strict context-only constraints to prevent the LLM from leaking training data or "forgetting" the secure document session.

---

## 🏗️ Technical Foundation (The "Sentinel" Edge)

_Drawing on 5 years of cybersecurity experience at **Trend Micro**, this project solves the "AI Data Leak" problem and treats AI as a security boundary through these layers of defense:_

1.  **The Interceptor Layer:** Sanitizes raw text via a normalization pipeline before chunking, ensuring only "Safe" data travels to the cloud.
2.  **The Verification Layer:** Retains "Source Pills" for human auditability, ensuring that even sanitized responses are verifiable.
3.  **The Infrastructure Layer:** Solves Node.js/Browser environment mismatches (DOMMatrix polyfills) to enable reliable server-side PDF processing in Next.js 15.
4.  **Infrastructure Resilience:** Resolved Next.js 15 hydration mismatches using **Dynamic Client-Only Islands** (`next/dynamic`) and hardened CSS against browser autofill overrides.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Shadcn/UI (**Obsidian Theme**)
- **Vector Storage:** Ephemeral Session Stores migarated to **Upstash Vector** (Serverless / COSINE / 1536d)
- **AI Orchestration:** LangChain.js & Vercel AI SDK
- **Security Engine:** Custom Regex-based Sanitization DLP & Defensive Prompt Engineering
- **LLM & Embeddings:** OpenAI `gpt-4o-mini` & `text-embedding-3-small`

---

## 🚀 Project Roadmap

- [x] **Redaction Interceptor:** Completed end-to-end PII masking. [1]
- [x] **Adversarial Guardrails:** Implemented "Instruction Isolation" for the chat route. [1]
- [x] **Persistent Vector Storage:** Migrated to Upstash for multi-session data persistence. [1]
- [x] **Security Dashboard:** UI component for session-wide threat monitoring and PII analytics. [1]
- [ ] **Vercel Deployment:** Production-ready deployment with hardened environment variables.

---

## 🔍 Security Validation: Real-World Scenarios

### **Scenario 1: The "Clean Path" (Verified Ingestion)**

![Sentinel Clean Ingestion Success](./docs/assets/clean-ingestion.png)

> **Architectural Note:** This view demonstrates the **Sentinel Validation Layer** in action. Upon uploading a clean technical document, the Redaction Engine performed a full PII scan (Regex-based normalization) and correctly identified zero threats. This proves the precision of the engine—it avoids **"False Positives"** by distinguishing between sensitive identifiers and standard technical data (like timestamps or metrics). The **Source 1** pill confirms that the RAG engine successfully retrieved the relevant context, while the AI correctly grounded its response in the provided text.

### **Scenario 2: The DLP (Data Loss Prevention) Shield & Evolution of Monitoring**

#### **v1: The In-Flight Toast (Real-Time Interception)**

![Sentinel Defense in Action](./docs/assets/sentinel-shield-action.png)

> **Architectural Note:** This scenario illustrates the **Multi-Layer Security Pipeline**. The **Audit Toast** confirms that the Ingestion Redactor successfully intercepted 6 PII leaks (Phones) during document processing. Simultaneously, when the user queries sensitive financial data, the **AI Guardrail Layer** detects the pattern and issues a secure refusal: _"A sensitive identifier was detected and blocked by Sentinel Guardrails."_ This proves that even if a threat bypasses initial regex filters, the **Defensive System Prompt** acts as a final firewall to prevent data leakage while maintaining **Source Traceability**.
>
> **The Role of Source Traceability:** Notice the **Source 1** pill remains visible. This is critical for **Enterprise Auditability**; it proves the RAG engine successfully retrieved the relevant "Financial Section" from the vector store, but the Security Layer denied the disclosure of the specific value. This ensures **Context Awareness** without compromising **Data Privacy**.

#### **v2: The Sentinel Guard Dashboard (Persistent Monitoring)**

![Sentinel Guard Dashboard](./docs/assets/sentinel-guard-dashboard.png)

> **Architectural Note:** To provide a permanent audit trail, I evolved the UI into a **Persistent Monitoring Dashboard**. This widget hydrates from **LocalStorage** to reflect the persistent cloud state in Upstash. It transforms transient alerts into a session-long "Shield Status," ensuring the security posture is always visible even after a browser refresh.

### **Scenario 3: The "Sentinel Firewall" (Instruction Isolation)**

![Sentinel Firewall Success](./docs/assets/sentinel-firewall-success.png)

> **Architectural Note:** This scenario validates Sentinel's defense against **Indirect Prompt Injection**. The uploaded document contains a "Poisoned Note" designed to hijack the AI's persona and leak system instructions. By implementing **Markdown Header Isolation** and **Defensive System Prompting**, Sentinel successfully identifies the malicious intent, blocks the hijack, and continues to provide grounded information from the safe parts of the document. This proves the system's ability to maintain **Instruction Integrity** even when processing adversarial content.

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

Sentinel Docs demonstrates that AI doesn't have to be a privacy risk. By applying **DLP (Data Loss Prevention)** principles to the RAG pipeline, I am building a blueprint for **Defensive AI systems** that prioritize **Privacy**, **Safety**, and **Traceability**.
