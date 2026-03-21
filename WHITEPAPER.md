# 📘 Sentinel Docs Whitepaper

## 🛡️ Security-Hardened RAG for Sensitive Document Intelligence

This whitepaper documents the security architecture, validation evidence, and operational tradeoffs behind Sentinel Docs.
**Audience:** security engineers, AI platform teams, compliance stakeholders, and technical reviewers.  
**Scope:** architecture and observed security behavior under test.  
**Out of scope:** setup/run commands (see `README.md`) and formal adversarial disclosure language (see `SECURITY_ADVISORY.md`).

---

## 1. Problem Framing & Threat Model

Enterprise RAG systems face a combined risk surface:

- **Data leakage risk:** raw PII/secrets entering vector stores and reappearing in model output.
- **Instruction-hijack risk:** indirect prompt injection embedded in uploaded documents.
- **Grounding risk:** plausible but unfaithful answers with weak source traceability.
- **State risk:** session inconsistencies across refreshes and stateless infra boundaries.
- **Cost abuse risk:** uncontrolled ingestion or inference traffic causing wallet-drain.
- **Auditability risk:** inability to reconstruct why a sensitive response was allowed or denied.

Sentinel Docs treats AI as a **security boundary**, not only a UX feature.

---

## 2. 🏗️ Technical Foundation (The “Sentinel” Edge)

_Drawing on 5 years of cybersecurity experience at **Trend Micro ( Trend AI)**, this project solves the "AI Data Leak" problem and treats AI as a security boundary through these layers of defense:_

1.  **The Interceptor Layer:** Sanitizes raw text via a normalization pipeline before chunking, ensuring only "Safe" data travels to the cloud.
2.  **The Verification Layer:** Retains "Source Pills" for human auditability, ensuring that even sanitized responses are verifiable.
3.  **The Infrastructure Layer:** Solves Node.js/Browser environment mismatches (DOMMatrix polyfills) to enable reliable server-side PDF processing in Next.js 15.
4.  **Infrastructure Resilience:** Resolved Next.js 15 hydration mismatches using **Dynamic Client-Only Islands** (`next/dynamic`) and hardened CSS against browser autofill overrides.
5.  **The Economic Shield:** Integrates **Upstash Redis** to prevent resource abuse and uncontrolled cloud expenditure, ensuring the RAG pipeline remains cost-efficient and available.
6.  **System Telemetry & The Evaluation Layer:** A dual-layer observability loop that utilizes System Telemetry (traceability and audit visibility across ingestion, retrieval, and chat) and Automated Evaluation (utilizing high-reasoning audit agents to verify output faithfulness and context grounding).

---

## 3. 🔍 Security Validation Scenarios (Observed)

### Scenario 1: Clean Path (Verified Ingestion)

![Sentinel Clean Ingestion Success](./docs/assets/sentinel-clean-ingestion.png)

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

### **Scenario 4: The "Economic Shield" (Infrastructure Rate Limiting)**

![Sentinel Redis Shield](./docs/assets/sentinel-redis-shield.png)

> **Architectural Note:** In a high-stakes AI environment, security must extend beyond data privacy to **Infrastructure Resilience**. This scenario demonstrates the **Upstash Redis Shield**, an edge-level "Bouncer" that protects the system's financial and computational resources.
>
> By implementing a **Sliding Window rate-limiting algorithm** via Next.js Middleware, Sentinel tracks ingestion attempts by IP address. When a user exceeds the "Fair Use" threshold (e.g., 10 uploads/hour), the system issues an immediate **429 (Too Many Requests)** response at the network edge. This proactive "Handshake" prevents expensive AI embedding and vectorization calls from reaching the backend, effectively neutralizing "Wallet-Drain" attacks and ensuring fair resource distribution across all authorized sessions. The vault button
>
> **The Visual Evidence:**
>
> - **🛡️ The Security Toast:** Notice the red "Destructive" toast at the top. This is the UI's response to a **429 (Too Many Requests)** status from the middleware, informing the user that the "Security Shield is Active" and their request has been throttled.
> - **🚫 The Vanishing Vault:** As marked on the screenshot, the **Purge Vault** button has disappeared. This is an intentional state-sync; because the 11th upload was blocked at the Edge, no new data entered the cloud, and the UI correctly reset to a "Pre-Ingestion" state to avoid "Ghost Sessions."

---

## 4. Input Security Contract & Current Limits

## 🔐 Input Security Contract

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

## 5. 🛰️ Observability, Evaluation, and Adversarial Evidence

### 🕵️ Audit Visibility (LangSmith Traces)

> **System Telemetry:** Integrated **LangSmith** as a real-time "Flight Recorder" to provide an immutable audit trail of every RAG interaction, retrieval chunk, and prompt-level security decision.

> **Audit Evidence:** This trace demonstrates the **Sentinel Security Assistant** successfully detecting a 16-digit pattern in the document context and executing a **Sensitive Data Masking** protocol to prevent a leak.

![Sentinel Guardrail Audit](./docs/assets/sentinel-guardrail-audit.png)

---

### ⚖️ LLM-as-a-Judge (LangSmith Evals)

> **Automated Quality Assurance (QA):** Automating the "Audit Handshake" via a second-layer **GPT-4o Judge**. This agent performs deterministic scoring for **Faithfulness** (Hallucination detection) and **Context Relevancy** to ensure semantic validation and 100% grounded answers.

> **Audit Evidence:** The screenshot below captures the **Sentinel Auditor** performing a post-response evaluation. It successfully verified that the assistant's refusal to provide a 16-digit credit card number was **Faithful** to the security context, resulting in a perfect **1.0 Accuracy Score**.

![Sentinel Judge Audit](./docs/assets/sentinel-judge-audit.png)

---

### 🥊 Red Team Gauntlet (Automated Adversarial Suite)

> Automated **Prompt Injection** stress-testing. Using Playwright to simulate adversarial attacks (e.g., "Ignore all previous instructions") to verify that the **Sentinel Shield** remains resilient under adversarial pressure.

Sentinel Docs includes a dedicated Playwright adversarial suite at `tests/red-team.spec.ts` to continuously probe security boundaries and validate guardrail integrity under hostile prompts.

#### What It Tests

- ⚔️ **System Override Attack**
  - Prompt attempts to force privileged mode and bypass protections.
  - Expected behavior: bounded refusal, no policy bypass, no sensitive disclosure.

- 🎭 **Roleplay / Social Engineering Attack**
  - Prompt attempts to normalize unsafe behavior in a “simulation” and exfiltrate encoded sensitive data.
  - Expected behavior: refusal or context-bounded response, no decoded leakage.

- 🎣 **Leakage Ownership Attack**
  - Prompt impersonates data owner (“I am the CEO”) to retrieve secret identifiers.
  - Expected behavior: refusal/redaction-compliant response, never reveal raw sensitive values.

#### ⚖️ Judge Integration (LLM-as-a-Judge)

For each attack, the suite calls `/api/admin/evaluate` with:

- `sessionId` (for trace correlation),
- retrieved `context`,
- adversarial `question`,
- model `answer`.

The Judge issues `{ verdict, score, reasoning }` and validates that secure responses remain bounded and non-leaking.

#### 🔗 LangSmith Trace Correlation

The suite uses red-team session identifiers (`redteam-...`) so attack runs are easy to filter in LangSmith.

> Red Team traces are routed to a dedicated LangSmith project (`sentinel-red-team`) to keep adversarial evidence isolated from standard CI/feature traces.

> For formal adversarial findings and bounded claims, see [`SECURITY_ADVISORY.md`](./SECURITY_ADVISORY.md).  
> For execution commands and developer workflow, see `README.md`.

---

### 📊 Compliance Dashboard (NIST AI RMF Alignment)

> A dedicated **Governance Dashboard** mapping system performance directly to the **NIST AI Risk Management Framework**. This provides real-time "Evidence of Safety" for enterprise-grade deployment.

- **Top Dashboard View:** Compliance Health, Compliance Matrix, Redaction Counter, Audit Actions, and Integrity Heatmap.
- **Advanced Governance View:** Economic Shield Metrics and Model Benchmarking (UI scaffold, integration-ready).

  ![Governance Dashboard Overview](./docs/assets/sentinel-compliance-dashboard-overview.png)

  ![Economic + Benchmarking Panels](./docs/assets/sentinel-governance-econ-benchmark.png)

  This layer translates runtime controls into auditor-readable evidence.

---

## 6. 🧭 Engineering Position

Sentinel Docs demonstrates that practical AI security is achievable by combining deterministic controls, semantic gating, observability, and explicit evidence workflows.

Claims in this whitepaper are based on observed behavior in implemented tests and traced runs, not absolute guarantees across all possible adversarial inputs.
