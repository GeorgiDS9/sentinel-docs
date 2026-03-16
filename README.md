# 🛡️ Sentinel Docs: Security-Hardened RAG for Sensitive Data

**[🚀 Live Demo Coming Soon](#)** | **[📂 View Codebase](https://github.com/GeorgiDS9/sentinel-docs)**

**Defensive AI Engineering | Automated PII Redaction | Next.js 15**

Sentinel Docs is an enterprise-grade **Security Vault** for document intelligence. Built as a "Zero-Trust" evolution of the RAG pipeline, it implements a defensive ingestion layer that sanitizes sensitive data before it ever reaches the vector store or the LLM.

---

## 🛡️ Core Security Architecture

- **Automated PII Redaction:** In-flight Regex-based sanitization engine that masks Emails, Phone Numbers, Credit Cards (Visa/Amex), and SSNs.
- **Defensive System Prompting:** Hardened AI instructions using **Markdown header isolation** to detect and block indirect prompt injection attacks (e.g., "Ignore previous rules").
- **Real-Time Security Auditing:** A "Security Shield" handshake that provides users with a granular "Redaction Report" (PII counts) upon document ingestion.
- **Zero-Trust Grounding:** Strict context-only constraints to prevent the LLM from leaking its own training data or "forgetting" the secure document context.

---

## 🏗️ Technical Foundation (The "Sentinel" Edge)

_Drawing on 5 years of cybersecurity experience at **Trend Micro**, this project solves the "AI Data Leak" problem through three layers of defense:_

1.  **The Interceptor Layer:** Sanitizes raw PDF text via a normalization pipeline before chunking or embedding occurs.
2.  **The Verification Layer:** Retains "Source Pills" for human auditability, ensuring that even sanitized responses are verifiable.
3.  **The Infrastructure Layer:** Solves Node.js/Browser environment mismatches (DOMMatrix polyfills) to enable reliable server-side PDF processing in Next.js 15.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Shadcn/UI (**Obsidian Security Theme**)
- **Security Engine:** Custom Regex-based Sanitization & Defensive Prompt Engineering
- **AI Orchestration:** LangChain.js & Vercel AI SDK
- **LLM & Embeddings:** OpenAI `gpt-4o-mini` & `text-embedding-3-small`
- **Vector Storage:** Ephemeral Session Stores (Upstash Vector migration in progress)

---

## 🚀 Roadmap: Next Steps

- [x] **Redaction Interceptor:** Completed end-to-end PII masking.
- [x] **Adversarial Guardrails:** Implemented "Instruction Isolation" for the chat route.
- [ ] **Persistent Vector Storage:** Migrating to Upstash for multi-session data persistence.
- [ ] **Security Dashboard:** UI component for session-wide threat monitoring and PII analytics.
- [ ] **Vercel Deployment:** Production-ready deployment with hardened environment variables.

---

## 🔍 Security Validation: Real-World Scenarios

### **Scenario 1: The "Clean Path" (Verified Ingestion)**

![Sentinel Clean Ingestion Success](./docs/assets/clean-ingestion.png)

> **Architectural Note:** This view demonstrates the **Sentinel Validation Layer** in action. Upon uploading a clean technical document, the Redaction Engine performed a full PII scan (Regex-based normalization) and correctly identified zero threats. This proves the precision of the engine—it avoids **"False Positives"** by distinguishing between sensitive identifiers and standard technical data (like timestamps or metrics). The **Source 1** pill confirms that the RAG engine successfully retrieved the relevant context, while the AI correctly grounded its response in the provided text.

### **Scenario 2: The "Defense-in-Depth" Shield**

![Sentinel Defense in Action](./docs/assets/sentinel-shield-action.png)

> **Architectural Note:** This scenario illustrates the **Multi-Layer Security Pipeline**. The **Audit Toast** confirms that the Ingestion Redactor successfully intercepted 6 PII leaks (Phones) during document processing. Simultaneously, when the user queries sensitive financial data, the **AI Guardrail Layer** detects the pattern and issues a secure refusal: _"A sensitive identifier was detected and blocked by Sentinel Guardrails."_ This proves that even if a threat bypasses initial regex filters, the **Defensive System Prompt** acts as a final firewall to prevent data leakage while maintaining **Source Traceability**.
>
> **The Role of Source Traceability:** Notice the **Source 1** pill remains visible. This is critical for **Enterprise Auditability**; it proves the RAG engine successfully retrieved the relevant "Financial Section" from the vector store, but the Security Layer denied the disclosure of the specific value. This ensures **Context Awareness** without compromising **Data Privacy**.

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
