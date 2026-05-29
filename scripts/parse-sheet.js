const fs = require("node:fs");

const DEFAULT_SHEET_PATH = process.env.JALKIWOTDA_SHEET_CSV || "";

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

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function cleanCell(value) {
  return String(value || "").replace(/\u00a0/g, " ").trim();
}

function splitLines(value) {
  return cleanCell(value)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
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
      if (cleanCell(next[column])) {
        previous[column] = next[column];
      } else if (cleanCell(previous[column])) {
        next[column] = previous[column];
      }
    }

    return next;
  });
}

function parseSheetRows(rows) {
  const headerIndex = rows.findIndex((row) => cleanCell(row[0]) === "캐릭명");

  if (headerIndex < 0) {
    throw new Error("Could not find sheet header row with 캐릭명");
  }

  const characters = [];
  let blockRows = [];

  for (const row of rows.slice(headerIndex + 2)) {
    blockRows.push(row);

    const name = cleanCell(row[0]);
    if (!name) {
      continue;
    }

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

function loadSheet(path = DEFAULT_SHEET_PATH) {
  if (!path) {
    throw new Error("Sheet CSV path is required");
  }

  const text = fs.readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  return parseSheetRows(parseCsv(text));
}

if (require.main === module) {
  const path = process.argv[2] || DEFAULT_SHEET_PATH;
  const characters = loadSheet(path);
  console.log(JSON.stringify({ count: characters.length, characters }, null, 2));
}

module.exports = {
  fillMergedSheetCells,
  loadSheet,
  parseCsv,
  parseSheetRows,
};
