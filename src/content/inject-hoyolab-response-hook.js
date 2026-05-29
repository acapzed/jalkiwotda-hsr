(() => {
  const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/1kRQjQrHsgIDqPdnyDCVXG59Ge8AaKm0dyJvj6Vp2AY4/export?format=csv&gid=0";
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("src/injected/hoyolab-response-hook.js");
  script.dataset.sheetUrl = SHEET_CSV_URL;
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);

  window.addEventListener("message", (event) => {
    if (event.source !== window) {
      return;
    }

    if (event.data?.type !== "JALKIWOTDA_HSR_RESPONSE") {
      return;
    }

    chrome.runtime
      .sendMessage({
        type: "JALKIWOTDA_HSR_RESPONSE",
        payload: event.data.payload,
      })
      .catch(() => {
        // The debug panel still works even when no background listener exists.
      });
  });

  window.addEventListener("message", async (event) => {
    if (event.source !== window) {
      return;
    }

    if (event.data?.type !== "JALKIWOTDA_HSR_SHEET_REQUEST") {
      return;
    }

    const requestId = event.data.requestId;

    try {
      const response = await chrome.runtime.sendMessage({
        type: "JALKIWOTDA_HSR_FETCH_SHEET",
        url: SHEET_CSV_URL,
      });

      window.postMessage(
        {
          type: "JALKIWOTDA_HSR_SHEET_RESPONSE",
          requestId,
          ok: Boolean(response?.ok),
          text: response?.text || "",
          error: response?.error || "",
        },
        window.location.origin,
      );
    } catch (error) {
      window.postMessage(
        {
          type: "JALKIWOTDA_HSR_SHEET_RESPONSE",
          requestId,
          ok: false,
          text: "",
          error: error?.message || String(error),
        },
        window.location.origin,
      );
    }
  });
})();
