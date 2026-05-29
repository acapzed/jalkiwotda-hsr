chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "JALKIWOTDA_HSR_FETCH_SHEET") {
    return false;
  }

  fetch(message.url)
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
