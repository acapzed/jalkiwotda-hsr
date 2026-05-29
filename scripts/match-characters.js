const { loadSheet } = require("./parse-sheet");
const { loadHoyolabCharacters } = require("./parse-hoyolab");

const DEFAULT_SHEET_PATH = process.env.JALKIWOTDA_SHEET_CSV || "";
const DEFAULT_HOYOLAB_PATH = process.env.JALKIWOTDA_HOYOLAB_JSON || "";

const ALIASES = new Map([
  ["Dr.레이시오", "레이시오"],
  ["Dr레이시오", "레이시오"],
  ["블랙스완", "블랙스완"],
  ["블랙 스완", "블랙스완"],
  ["완매", "완매"],
  ["완•매", "완매"],
]);

const PATH_SUFFIX_BY_BASE_TYPE = new Map([
  [1, "파멸"],
  [2, "수렵"],
  [3, "지식"],
  [4, "화합"],
  [5, "공허"],
  [6, "보존"],
  [7, "풍요"],
  [8, "기억"],
  [9, "환락"],
  ["Warrior", "파멸"],
  ["Knight", "보존"],
  ["Rogue", "수렵"],
  ["Mage", "지식"],
  ["Shaman", "화합"],
  ["Warlock", "공허"],
  ["Priest", "풍요"],
  ["Memory", "기억"],
  ["Joy", "환락"],
]);

function normalizeName(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, "")
    .replace(/[·.•]/g, "")
    .trim();
}

function resolveSheetName(character, sheetByNormalizedName) {
  const normalized = normalizeName(character.name);
  const alias = ALIASES.get(normalized);

  if (alias) {
    return alias;
  }

  if (normalized === "개척자") {
    const suffix = PATH_SUFFIX_BY_BASE_TYPE.get(character.path);
    return suffix ? `개척자•${suffix}` : null;
  }

  if (normalized === "Mar7th") {
    const suffix = PATH_SUFFIX_BY_BASE_TYPE.get(character.path);
    return suffix ? `Mar.7•${suffix}` : null;
  }

  return sheetByNormalizedName.get(normalized)?.name || null;
}

function matchCharacters(sheetPath = DEFAULT_SHEET_PATH, hoyolabPath = DEFAULT_HOYOLAB_PATH) {
  const sheetCharacters = loadSheet(sheetPath);
  const hoyolabCharacters = loadHoyolabCharacters(hoyolabPath);
  const sheetByNormalizedName = new Map(
    sheetCharacters.map((character) => [normalizeName(character.name), character]),
  );

  const matches = hoyolabCharacters.map((character) => {
    const sheetName = resolveSheetName(character, sheetByNormalizedName);
    const sheet = sheetName ? sheetByNormalizedName.get(normalizeName(sheetName)) : null;

    return {
      id: character.id,
      hoyolabName: character.name,
      sheetName,
      matched: Boolean(sheet),
      sheet,
      character,
    };
  });

  return { sheetCharacters, hoyolabCharacters, matches };
}

if (require.main === module) {
  const sheetPath = process.argv[2] || DEFAULT_SHEET_PATH;
  const hoyolabPath = process.argv[3] || DEFAULT_HOYOLAB_PATH;
  const { sheetCharacters, hoyolabCharacters, matches } = matchCharacters(sheetPath, hoyolabPath);
  const missing = matches.filter((match) => !match.matched);

  console.log(`sheet characters: ${sheetCharacters.length}`);
  console.log(`hoyolab characters: ${hoyolabCharacters.length}`);
  console.log(`matched: ${matches.length - missing.length}`);
  console.log(`missing: ${missing.length}`);

  if (missing.length) {
    console.log("\nmissing:");
    for (const match of missing) {
      console.log(`- ${match.hoyolabName} (${match.id}, path=${match.character.path || ""})`);
    }
  }
}

module.exports = {
  matchCharacters,
  normalizeName,
  resolveSheetName,
};
