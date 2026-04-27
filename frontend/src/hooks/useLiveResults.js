import { useEffect, useState } from "react";
import { fetchResults } from "../services/api.js";

export function useLiveResults(shortId, intervalMs = 8000) {
  const [payload, setPayload] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    let timerId;

    async function loadResults() {
      try {
        const data = await fetchResults(shortId);

        if (isCancelled) {
          return;
        }

        setPayload(data);
        setStatus("ready");
        setError("");
        setLastUpdatedAt(new Date());
      } catch (requestError) {
        if (isCancelled) {
          return;
        }

        setError(requestError.message);
        setStatus((current) => (current === "ready" ? "ready" : "error"));
      }
    }

    setStatus("loading");
    loadResults();
    timerId = window.setInterval(loadResults, intervalMs);

    return () => {
      isCancelled = true;
      window.clearInterval(timerId);
    };
  }, [shortId, intervalMs]);

  return {
    payload,
    status,
    error,
    lastUpdatedAt,
  };
}
