(() => {
  const app = window.JALKIWOTDA_HSR;
  if (!app) return;
  const { cleanCell, splitLines } = app.utils;

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (inQuotes) {
        if (char === '"' && next === '"') {
          field += '"';
          index += 1;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          field += char;
        }
        continue;
      }

      if (char === '"') inQuotes = true;
      else if (char === ",") { row.push(field); field = ""; }
      else if (char === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (char !== "\r") field += char;
    }

    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

    return rows;
  }

  function parseMainStats(row) {
    const mainStats = {
      body: splitLines(row[7]),
      feet: splitLines(row[8]),
      sphere: splitLines(row[9]),
      rope: splitLines(row[10]),
    };

    if (mainStats.sphere.length > 0 && mainStats.rope.length === 0) {
      mainStats.rope = [...mainStats.sphere];
    }

    return mainStats;
  }

  function fillMergedSheetCells(rows) {
    const fillColumns = [4, 5, 6, 7, 8, 9, 10, 13, 14];
    const previous = [];

    return rows.map((row) => {
      const next = [...row];
      for (const column of fillColumns) {
        if (cleanCell(next[column])) previous[column] = next[column];
        else if (cleanCell(previous[column])) next[column] = previous[column];
      }
      return next;
    });
  }

  function parseSheetRows(rows) {
    const headerIndex = rows.findIndex((row) => cleanCell(row[0]) === "캐릭명");
    if (headerIndex < 0) throw new Error("Could not find sheet header row with 캐릭명");

    const characters = [];
    let blockRows = [];

    for (const row of rows.slice(headerIndex + 2)) {
      blockRows.push(row);
      const name = cleanCell(row[0]);
      if (!name) continue;

      const variants = fillMergedSheetCells(blockRows)
        .filter((blockRow) => blockRow.some((cell, index) => index > 0 && cleanCell(cell)))
        .map((blockRow) => ({
          path: cleanCell(blockRow[1]),
          traces: cleanCell(blockRow[2]),
          role: cleanCell(blockRow[3]),
          lightCones: splitLines(blockRow[4]),
          relicSets: splitLines(blockRow[5]),
          ornamentSets: splitLines(blockRow[6]),
          mainStats: parseMainStats(blockRow),
          usefulSubstats: splitLines(blockRow[11]),
          eidolons: cleanCell(blockRow[12]),
          statTarget: cleanCell(blockRow[13]),
          critTarget: cleanCell(blockRow[14]),
          notes: cleanCell(blockRow[15]),
        }));

      characters.push({ name, variants });
      blockRows = [];
    }

    return characters;
  }

  function requestSheetTextFromExtension() {
    return new Promise((resolve, reject) => {
      const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const timeoutId = window.setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("Sheet request timed out"));
      }, 10000);

      function handleMessage(event) {
        if (event.source !== window || event.origin !== window.location.origin) return;
        if (event.data?.type !== "JALKIWOTDA_HSR_SHEET_RESPONSE" || event.data.requestId !== requestId) return;

        window.clearTimeout(timeoutId);
        window.removeEventListener("message", handleMessage);

        if (event.data.ok) resolve(event.data.text || "");
        else reject(new Error(event.data.error || "Sheet request failed"));
      }

      window.addEventListener("message", handleMessage);
      window.postMessage({ type: "JALKIWOTDA_HSR_SHEET_REQUEST", requestId }, window.location.origin);
    });
  }

  async function loadSheetText() {
    try {
      return await requestSheetTextFromExtension();
    } catch (error) {
      console.warn("[jalkiwotda-hsr] extension sheet bridge failed, falling back to fetch", error);
    }

    const response = await fetch(app.config.sheetUrl);
    if (!response.ok) throw new Error(`Sheet fetch failed: HTTP ${response.status}`);
    return response.text();
  }

  async function loadSheetCharacters() {
    if (app.state.sheetCharactersCache) return app.state.sheetCharactersCache;
    if (!app.config.sheetUrl) throw new Error("Sheet URL is not configured");

    const text = await loadSheetText();
    app.state.sheetCharactersCache = parseSheetRows(parseCsv(text.replace(/^\uFEFF/, "")));
    return app.state.sheetCharactersCache;
  }

  Object.assign(app.sheet, { parseCsv, parseSheetRows, loadSheetCharacters });
})();
