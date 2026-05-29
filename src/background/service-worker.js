const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1kRQjQrHsgIDqPdnyDCVXG59Ge8AaKm0dyJvj6Vp2AY4/export?format=csv&gid=0";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "JALKIWOTDA_HSR_FETCH_SHEET") {
    return false;
  }

  if (message.url !== SHEET_CSV_URL) {
    sendResponse({ ok: false, error: "URL not allowed" });
    return false;
  }

  fetch(SHEET_CSV_URL)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Sheet fetch failed: HTTP ${response.status}`);
      }

      sendResponse({ ok: true, text: await response.text() });
    })
    .catch((error) => {
      sendResponse({ ok: false, error: error?.message || String(error) });
    });

  return true;
});
