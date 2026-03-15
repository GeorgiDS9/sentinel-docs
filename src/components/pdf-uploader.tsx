"use client";

import { CloudUpload, FileText, Sparkles } from "lucide-react";

import { useSessionId } from "@/hooks/use-session-id";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { useState } from "react";

export function PDFUploader() {
  const sessionId = useSessionId();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF document.",
      });
      return;
    }

    if (!sessionId) {
      toast({
        title: "Preparing workspace",
        description: "Please wait a moment and try again.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sessionId", sessionId);

      const response = await fetch("/api/rag/ingest", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Failed to ingest document.");
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("sentinel-docs-ingested", "true");
      }

      toast({
        title: "Document ready for chat!",
        description: "Ask a question about your PDFs…",
      });
    } catch (error) {
      toast({
        title: "Ingestion failed",
        description:
          (error as Error).message ||
          "We couldn’t prepare this document. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border-white/15 bg-slate-950/30 p-4 backdrop-blur-2xl shadow-inner shadow-slate-950/60">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/10">
              <CloudUpload className="size-3 text-sky-300" />
              <span>Secure Document Ingestion</span>
            </div>
            <p className="text-sm text-slate-100">
              Upload sensitive contracts or research PDFs. Sentinel
              automatically <strong>redacts PII</strong> and sanitizes data
              before semantic chunking and vectorization.
            </p>
            <p className="text-[11px] text-slate-400">
              Documents are processed in <strong>Ephemeral RAM</strong>,
              segmented into 1000-character slices, and isolated to this
              session. No data persists on disk.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-500/90 px-3 py-2 text-xs font-medium text-slate-950 shadow-lg shadow-emerald-500/40 ring-1 ring-emerald-400/60 hover:bg-emerald-400">
              <FileText className="size-3.5" />
              <span>{isProcessing ? "Processing…" : "Upload PDF"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
            </label>
            <div className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-slate-900/80 px-3.5 py-1.5 text-xs text-slate-300 ring-1 ring-white/10">
              <Sparkles className="size-3 text-violet-300" />
              <span>PII-Sanitized RAG Pipeline</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-white/10 bg-slate-950/40 p-3 backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-100">
              Encrypted Workspaces
            </p>
            <p className="text-[11px] text-slate-400">
              Once ingestion is complete, your sanitized document collections
              will be isolated here for the duration of the session.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-slate-900/80 px-3.5 py-1 text-[10px] text-slate-300 ring-1 ring-white/10">
              Session-Isolated
            </span>
            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-slate-900/80 px-3.5 py-1 text-[10px] text-slate-300 ring-1 ring-white/10">
              Ephemeral Vector Store
            </span>
            <span className="inline-flex items-center whitespace-nowrap rounded-full bg-slate-900/80 px-3.5 py-1 text-[10px] text-slate-300 ring-1 ring-white/10">
              Encrypted Session Storage
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
