(() => {
  const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/1kRQjQrHsgIDqPdnyDCVXG59Ge8AaKm0dyJvj6Vp2AY4/export?format=csv&gid=0";
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("src/injected/hoyolab-response-hook.js");
  script.dataset.sheetUrl = SHEET_CSV_URL;
  script.dataset.reportImageUrl = chrome.runtime.getURL("src/assets/report-button.webp");
  script.dataset.statIconUrl = chrome.runtime.getURL("src/assets/icon-32.png");
  script.dataset.hpIconUrl = chrome.runtime.getURL("src/assets/hp-icon.webp");
  script.dataset.atkIconUrl = chrome.runtime.getURL("src/assets/atk-icon.webp");
  script.dataset.defIconUrl = chrome.runtime.getURL("src/assets/def-icon.webp");
  script.dataset.spdIconUrl = chrome.runtime.getURL("src/assets/spd-icon.webp");
  script.dataset.critRateIconUrl = chrome.runtime.getURL("src/assets/crit-rate-icon.webp");
  script.dataset.critDmgIconUrl = chrome.runtime.getURL("src/assets/crit-dmg-icon.webp");
  script.dataset.breakIconUrl = chrome.runtime.getURL("src/assets/break-icon.webp");
  script.dataset.ehrIconUrl = chrome.runtime.getURL("src/assets/ehr-icon.webp");
  script.dataset.errIconUrl = chrome.runtime.getURL("src/assets/err-icon.webp");
  script.dataset.healIconUrl = chrome.runtime.getURL("src/assets/heal-icon.webp");
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
