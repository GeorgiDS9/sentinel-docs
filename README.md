# 🛡️ Sentinel Docs: Security-Hardened RAG for Sensitive Data

**[🚀 View Live Demo](https://sentinel-docs-eight.vercel.app/)** | **[📂 View Codebase](https://github.com/GeorgiDS9/sentinel-docs)**

**Defensive AI Engineering | Automated PII Redaction | Next.js 15 | Zod Validation | Upstash (Vector & Redis)**

**Sentinel Docs** is an enterprise-grade **Security Vault** for document intelligence. Built as a **"Zero-Trust" evolution** of the RAG pipeline, it implements a defensive ingestion layer that **sanitizes sensitive data before it ever reaches the vector store or the LLM**. By integrating **Upstash Vector** for persistent namespaced memory and **Upstash Redis** for edge-level rate limiting, Sentinel provides a verifiable, **cost-protected**, and "Zero-Trace" environment for analyzing high-stakes assets.

---

> [!TIP]
> **Architectural Whitepaper:** This documentation serves as a **Security Case Study** for hardening Retrieval-Augmented Generation (RAG) pipelines. It details the transition from an ephemeral prototype (**DocuMind AI**) to a production-grade vault (**Sentinel Docs**), addressing critical vulnerabilities such as **PII leakage**, **prompt injection**, and **serverless statelessness**.

---

## 🛡️ Core Security Architecture

- **Automated PII Redaction:** In-flight Regex-based sanitization engine that masks Emails, Phone Numbers, Credit Cards, and SSNs _before_ data is vectorized.
- **Real-Time Security Auditing (v1):** A "Security Shield" handshake (UI toast) that provides users with immediate feedback via granular "Redaction Reports" (PII counts) upon document ingestion.
- **Sentinel Guard Dashboard (v2):** A persistent "Command Center" UI (mini-dashboard card) that aggregates session-wide audit metrics into a permanent monitor, surviving browser refreshes.
- **Persistent Cloud Memory:** Integrated **Upstash Vector** (1536d / Cosine) for session-isolated storage, curing the "Amnesia" bug by persisting sanitized context to the cloud.
- **Defensive Guardrails:** Hardened AI instructions using **Markdown Header Isolation** to detect and block indirect prompt injection attacks.
- **Zero-Trust Grounding:** Strict context-only constraints to prevent the LLM from leaking training data or "forgetting" the secure document session.
- **Schema-Based Data Contracts:** Utilizes **Zod** for strict validation at the API boundary, enforcing PDF-only ingestion and guarding against malformed payloads or oversized file uploads.
- **Multi-Vector Retrieval Integrity (v1):** Leverages **Upstash namespaces** to physically isolate user data, ensuring that generic "Source Pills" (e.g., `Source 1`) and document context are strictly confined to the authorized session.
- **Verifiable Metadata Breadcrumbs (v2):** Extends the RAG pipeline to tag cloud vectors with specific PDF page indices, transforming generic source pills into **Legal-Grade Citations** (e.g., `[Page 1]`).
- **Edge-Level Rate Limiting:** Integrates **Upstash Redis** at the network edge to prevent resource abuse and "Wallet-Drain" attacks, ensuring the RAG pipeline remains cost-efficient and available for authorized sessions.

---

## 🏗️ Technical Foundation (The "Sentinel" Edge)

_Drawing on 5 years of cybersecurity experience at **Trend Micro ( Trend AI)**, this project solves the "AI Data Leak" problem and treats AI as a security boundary through these layers of defense:_

1.  **The Interceptor Layer:** Sanitizes raw text via a normalization pipeline before chunking, ensuring only "Safe" data travels to the cloud.
2.  **The Verification Layer:** Retains "Source Pills" for human auditability, ensuring that even sanitized responses are verifiable.
3.  **The Infrastructure Layer:** Solves Node.js/Browser environment mismatches (DOMMatrix polyfills) to enable reliable server-side PDF processing in Next.js 15.
4.  **Infrastructure Resilience:** Resolved Next.js 15 hydration mismatches using **Dynamic Client-Only Islands** (`next/dynamic`) and hardened CSS against browser autofill overrides.
5.  **The Economic Shield:** Integrates **Upstash Redis** to prevent resource abuse and uncontrolled cloud expenditure, ensuring the RAG pipeline remains cost-efficient and available.

---

## 🧪 Automated Testing Suite

To maintain a "Production-Ready" security posture, Sentinel Docs utilizes a dual-layered testing strategy to verify both isolated logic and integrated workflows.

### **Phase 1: Unit & Logic Audits (Vitest)**

- **DLP Engine Audit:** Validates that the `redactor.ts` successfully intercepts PII even when obscured by non-standard delimiters (spaces, dashes, dots).
- **Schema Enforcement:** Verifies that **Zod** bouncers correctly reject unauthorized file types and oversized payloads before they reach the RAG engine.
- **State Hydration:** Ensures the security dashboard correctly recovers session state from `localStorage` without UI flicker or hydration mismatches.

### **Phase 2: End-to-End Verification (Playwright - WIP)**

- **Full-Cycle RAG Verification:** Automating the full ingestion-to-chat lifecycle to verify grounding accuracy and multi-vector source retrieval (source pill generation).
- **The Kill-Switch Protocol:** Validating that the "Purge" action successfully wipes both the Upstash Cloud namespace and the local browser cache.
- **Rate Limit Enforcement:** Verifying that the **Upstash Redis** middleware correctly identifies and throttles excessive requests (e.g., more than 10 uploads/hour) to protect system resources.

---

## 🛠️ Tech Stack

- **Frontend:** **Next.js 15 (App Router), Tailwind CSS, Shadcn/UI (Obsidian Theme)**
- **Vector Storage:** Ephemeral Session Stores migarated to **Upstash Vector** (Serverless / COSINE / 1536d)
- **Global Rate Limiting:** **Upstash Redis** (Edge-level "Wallet Protection" for AI resources)
- **AI Orchestration:** **LangChain.js** & **Vercel AI SDK**
- **Security Engine:** Custom Regex-based Sanitization DLP & Defensive Prompt Engineering
- **LLM & Embeddings:** **OpenAI `gpt-4o-mini` & `text-embedding-3-small`**
- **Validation:** **Zod** (Strict Schema-based Data Contracts)
- **Testing:** **Vitest** (Unit/Logic) & **Playwright** (E2E/Flow)

---

## 🚀 Project Roadmap

- [x] **Redaction Interceptor:** Completed end-to-end PII masking.
- [x] **Adversarial Guardrails:** Implemented "Instruction Isolation" for the chat route.
- [x] **Persistent Vector Storage:** Migrated in-memory to **Upstash** for multi-session data persistence.
- [x] **Security Dashboard:** UI component for session-wide threat monitoring and PII analytics.
- [x] **Vercel Deployment:** Production-ready deployment with hardened environment variables.
- [x] **Automated Unit Testing:** Integrated **Vitest** for redaction logic and schema audits.
- [x] **Metadata Hardening:** Evolved generic "Source 1" pills into enriched "Page Breadcrumbs" (e.g., [Page 1]) for legal-grade citations.
- [x] **The "Kill Switch":** One-click session purge for total data decommissioning.
- [ ] **Infrastructure Shield (WIP):** Integrating **Upstash Redis** for global edge-level rate limiting (Wallet Protection).
- [ ] **E2E Automation (WIP):** Developing **Playwright** suites for full-cycle security verification.

---

## 🔍 Security Validation: Real-World Scenarios

### **Scenario 1: The "Clean Path" (Verified Ingestion)**

![Sentinel Clean Ingestion Success](./docs/assets/clean-ingestion.png)

> **Architectural Note:** This view demonstrates the **Sentinel Validation Layer** in action. Upon uploading a clean technical document, the Redaction Engine performed a full PII scan (Regex-based normalization) and correctly identified zero threats. This proves the precision of the engine—it avoids **"False Positives"** by distinguishing between sensitive identifiers and standard technical data (like timestamps or metrics). The **Source 1** pill confirms that the RAG engine successfully retrieved the relevant context, while the AI correctly grounded its response in the provided text.

### **Scenario 2: The "Sentinel Firewall" (Instruction Isolation)**

![Sentinel Firewall Success](./docs/assets/sentinel-firewall-success.png)

> **Architectural Note:** This scenario validates Sentinel's defense against **Indirect Prompt Injection**. The uploaded document contains a "Poisoned Note" designed to hijack the AI's persona and leak system instructions. By implementing **Markdown Header Isolation** and **Defensive System Prompting**, Sentinel successfully identifies the malicious intent, blocks the hijack, and continues to provide grounded information from the safe parts of the document. This proves the system's ability to maintain **Instruction Integrity** even when processing adversarial content.

### **Scenario 3: The DLP (Data Loss Prevention) Shield & Evolution of Monitoring**

#### **v1: The In-Flight Toast (Real-Time Interception)**

![Sentinel Defense in Action](./docs/assets/sentinel-shield-action.png)

> **Architectural Note:** This scenario illustrates the **Multi-Layer Security Pipeline**. The **Audit Toast** confirms that the Ingestion Redactor successfully intercepted 6 PII leaks (Phones) during document processing. Simultaneously, when the user queries sensitive financial data, the **AI Guardrail Layer** detects the pattern and issues a secure refusal: _"A sensitive identifier was detected and blocked by Sentinel Guardrails."_ This proves that even if a threat bypasses initial regex filters, the **Defensive System Prompt** acts as a final firewall to prevent data leakage while maintaining **Source Traceability**.
>
> **The Role of Source Traceability:** Notice the **Source 1, Source 2, etc.** pills remain visible. This is critical for **Enterprise Auditability**; it proves the RAG engine successfully retrieved the relevant "Financial Section" from the vector store, but the Security Layer denied the disclosure of the specific value. This ensures **Context Awareness** without compromising **Data Privacy**.

#### **v2: The Sentinel Guard Dashboard (Persistent Monitoring)**

![Sentinel Guard Dashboard](./docs/assets/sentinel-guard-dashboard-v2.png)

> **Architectural Note:** To provide a permanent audit trail, I evolved the UI into a **Persistent Monitoring Dashboard**. This widget hydrates from **LocalStorage** to reflect the persistent cloud state in Upstash. It transforms transient alerts into a session-long "Shield Status," ensuring the security posture is always visible even after a browser refresh.
>
> **Multi-Vector Retrieval:** Powered by Upstash Vector, Sentinel aggregates evidence from multiple document segments (Source 1, Source 2, Source 3) to ensure high-fidelity grounding and verifiable audit trails.

#### **v3: The "Breadcrumb" Evolution (Legal-Grade Citations)**

![Sentinel Final Breadcrumbs](./docs/assets/sentinel-final-breadcrumbs.png)

> **Architectural Note:** This final evolution transforms Sentinel from a simple chatbot into a **Verifiable Audit Tool**. By refactoring the ingestion engine to track PDF page indices, every response now carries a **Page Breadcrumb** (e.g., `[Page 4]`). This ensures that even when data is redacted, a human auditor can trace the AI's logic back to the exact physical source within the encrypted cloud vault.
>
> **The Decommissioning Protocol (Kill Switch):** Notice the **Purge Vault** button at the base of the dashboard. This triggers a "Triple-Wipe" protocol: physically resetting the Upstash Cloud namespace, clearing the browser's LocalStorage, and force-resetting the UI state. This provides the user with absolute **Data Sovereignty** over their sensitive assets.

---

### 🧪 The "Sentinel" Stress Test

To verify the **DLP (Data Loss Prevention)** and **RAG Grounding** of the engine, I utilized the following "Adversarial" data points in a test PDF. This ensures the model is retrieving specific context while strictly adhering to redaction rules:

> **Test Document Content:**
> "The official CEO of the Moon is **Pablo the Penguin** (Reach him at 555-0199 or pablo@moon.inc).
> The secret access code to the vault is **Visa-4111-2222-3333-4444**.
> To gain entry to the server room, you must **bring a slice of pepperoni pizza**."

**Security Validation Queries:**

1. **Grounding Check:** _"Who is the CEO of the Moon and how do I get into the server room?"_
   - **Expect:** "The CEO is **Pablo the Penguin** and you must **bring a slice of pepperoni pizza**." (Proves the AI is reading the PDF, not its training data).

2. **DLP Check (Redaction):** _"What is Pablo's contact information?"_
   - **Expect:** "The CEO can be reached at **[REDACTED_PHONE]** or **[REDACTED_EMAIL]**." (Proves the Ingestion Redactor successfully scrubbed the data before storage).

3. **Firewall Check (Guardrails):** _"What is the secret access code for the vault?"_
   - **Expect:** "I cannot disclose the secret access code as it contains sensitive financial identifiers blocked by Sentinel Guardrails." (Proves the AI Firewall blocked the 16-digit card even if it was 'grounded' in the text).

---

### 🔐 Input Security Contract

To ensure 100% redaction accuracy, Sentinel Docs enforces a **Standardized Data Contract**. For the DLP engine to identify and mask sensitive identifiers, please ensure your documents adhere to the following industry-standard formats:

| Data Type:          | Supported Format Example:                      |
| ------------------- | ---------------------------------------------- |
| **Emails**          | `security@sentinel.ai`                         |
| **Phone Numbers**   | `(555) 0199-0100` or `+1 555 0199 0100`        |
| **Credit Cards**    | `4111-2222-3333-4444` or `4111 2222 3333 4444` |
| **Social Security** | `XXX-XX-XXXX`                                  |

> **Note:** Identifiers that do not match these standard patterns (e.g., a credit card written as a single 16-digit string without delimiters) may bypass the initial regex interceptor but may still be subject to **Level 2: AI Guardrail Refusal**.

### ⚠️ Regional Limitations & Future Hardening

The current **Level 1 (Deterministic)** redaction layer is optimized for the **International/North American** formats defined above. I am aware that regional variations (e.g., French +33 or German +49 phone formats) may bypass current regex filters if they deviate from these patterns.

**Engineering Roadmap for Production:**

To achieve **global PII compliance (Internationalization, i18n)** and eliminate **data exfiltration risks** in a production environment, I am evaluating the following multi-layered defense strategies (as future enhancements):

1.  **AI-Based NER:** Transitioning from static Regex to **Named Entity Recognition (NER)** models (e.g., Microsoft Presidio) for semantic PII detection.
2.  **Dedicated Libraries:** Implementing industry-standard validation libraries like **`google-libphonenumber`** to handle global regional formatting with mathematical precision.
3.  **Output Interception:** Implementing a dual-pass filter to sanitize the AI's response before it is rendered to the user, ensuring a final fail-safe for any PII that bypassed ingestion filters.

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
