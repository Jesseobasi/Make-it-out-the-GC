import { useEffect, useState } from "react";
import { fetchEvent } from "../services/api.js";

export function useEvent(shortId) {
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadEvent() {
      setStatus("loading");
      setError("");

      try {
        const data = await fetchEvent(shortId);

        if (isCancelled) {
          return;
        }

        setEvent(data.event);
        setStatus("ready");
      } catch (requestError) {
        if (isCancelled) {
          return;
        }

        setError(requestError.message);
        setStatus("error");
      }
    }

    loadEvent();

    return () => {
      isCancelled = true;
    };
  }, [shortId]);

  return {
    event,
    setEvent,
    status,
    error,
  };
}

