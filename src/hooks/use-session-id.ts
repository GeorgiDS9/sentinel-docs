"use client"

import { useEffect, useState } from "react"

function generateSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2)
}

export function useSessionId() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const storageKey = "documind-ai-session-id"
    let existing = window.localStorage.getItem(storageKey)

    if (!existing) {
      existing = generateSessionId()
      window.localStorage.setItem(storageKey, existing)
    }

    // This effect initializes session id from localStorage or generates one.
    // Disabling the lint rule here avoids a false positive for this setup step.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(existing)
  }, [])

  return sessionId
}

