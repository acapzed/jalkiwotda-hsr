(() => {
  if (window.__JALKIWOTDA_HSR_HOOK_INSTALLED__) {
    return;
  }

  window.__JALKIWOTDA_HSR_HOOK_INSTALLED__ = true;
  window.__JALKIWOTDA_HSR_RESPONSES__ = [];

  const TARGETS = [
    "/hkrpg/api/index",
    "/hkrpg/api/avatar/info",
    "/hkrpg/api/role/basicInfo",
  ];
  const WIKI_SET_LIST_URL =
    "https://sg-act-public-api.hoyolab.com/hoyowiki/hsr/wapi/get_entry_page_list";
  const WIKI_RELIC_SET_MENU_ID = "108";
  const WIKI_PAGE_SIZE = 30;
  const TABLE_STYLE = "width:max-content;min-width:100%;border-collapse:collapse;";
  const TABLE_CELL_STYLE =
    "border-bottom:1px solid #2b3442;padding:6px;text-align:left;vertical-align:top;";
  const MODAL_STYLE = [
    "position:fixed",
    "inset:40px",
    "z-index:2147483646",
    "overflow:auto",
    "padding:16px",
    "border:1px solid #5f6b7a",
    "border-radius:8px",
    "background:#10141d",
    "color:#fff",
    "font:12px/1.45 sans-serif",
    "box-shadow:0 8px 30px rgba(0,0,0,.55)",
  ].join(";");
  const PANEL_STYLE = [
    "position:fixed",
    "right:12px",
    "bottom:12px",
    "z-index:2147483647",
    "display:flex",
    "flex-direction:column",
    "gap:8px",
    "align-items:stretch",
    "width:188px",
    "padding:8px",
    "border:1px solid #5f6b7a",
    "border-radius:8px",
    "background:#151922",
    "color:#fff",
    "font:12px/1.2 sans-serif",
    "box-shadow:0 4px 16px rgba(0,0,0,.35)",
  ].join(";");
  const PANEL_BUTTON_STYLE = [
    "border:1px solid #8892a0",
    "border-radius:4px",
    "background:#242b36",
    "color:#fff",
    "width:100%",
    "padding:4px 6px",
    "font:12px/1 sans-serif",
    "cursor:pointer",
  ].join(";");
  const PANEL_IMAGE_STYLE = [
    "width:100%",
    "aspect-ratio:1/1",
    "object-fit:cover",
    "border-radius:6px",
    "background:#242b36",
    "display:block",
  ].join(";");
  const PANEL_COUNT_STYLE = [
    "display:flex",
    "justify-content:space-between",
    "align-items:center",
    "gap:8px",
  ].join(";");
  const PANEL_BUTTON_ROW_STYLE = [
    "display:flex",
  ].join(";");
  const REPORT_ICON_STYLE = [
    "width:24px",
    "height:24px",
    "object-fit:contain",
    "vertical-align:middle",
    "margin-right:8px",
  ].join(";");
  const STAT_ICON_STYLE = [
    "width:16px",
    "height:16px",
    "object-fit:contain",
    "vertical-align:-3px",
    "margin-right:4px",
  ].join(";");
  const INLINE_STAT_ICON_STYLE = [
    "width:16px",
    "height:16px",
    "object-fit:contain",
    "vertical-align:-3px",
    "margin-right:3px",
  ].join(";");
  const ITEM_ICON_STYLE = [
    "width:30px",
    "height:30px",
    "object-fit:contain",
    "vertical-align:middle",
    "margin-right:5px",
    "border-radius:4px",
    "background:#242b36",
  ].join(";");
  const EQUIPMENT_ICON_STYLE = [
    "width:60px",
    "height:60px",
    "object-fit:contain",
    "vertical-align:middle",
    "margin-right:5px",
    "border-radius:4px",
    "background:#242b36",
  ].join(";");
  const CHARACTER_ICON_STYLE = [
    "width:60px",
    "height:60px",
    "object-fit:cover",
    "vertical-align:middle",
    "margin-right:6px",
    "border-radius:4px",
    "background:#242b36",
  ].join(";");
  const CHECK_WEIGHTS = {
    lightCone: 2,
    relicSets: 4,
    ornamentSets: 4,
    body: 1,
    feet: 1,
    sphere: 1,
    rope: 1,
  };

  const SHEET_URL = document.currentScript?.dataset?.sheetUrl || "";
  const REPORT_IMAGE_URL = document.currentScript?.dataset?.reportImageUrl || "";
  const STAT_ICON_URL = document.currentScript?.dataset?.statIconUrl || "";
  const HP_ICON_URL = document.currentScript?.dataset?.hpIconUrl || "";
  const ATK_ICON_URL = document.currentScript?.dataset?.atkIconUrl || "";
  const DEF_ICON_URL = document.currentScript?.dataset?.defIconUrl || "";
  const SPD_ICON_URL = document.currentScript?.dataset?.spdIconUrl || "";
  const CRIT_RATE_ICON_URL = document.currentScript?.dataset?.critRateIconUrl || "";
  const CRIT_DMG_ICON_URL = document.currentScript?.dataset?.critDmgIconUrl || "";
  const BREAK_ICON_URL = document.currentScript?.dataset?.breakIconUrl || "";
  const EHR_ICON_URL = document.currentScript?.dataset?.ehrIconUrl || "";
  const ERR_ICON_URL = document.currentScript?.dataset?.errIconUrl || "";
  const HEAL_ICON_URL = document.currentScript?.dataset?.healIconUrl || "";

  // Local aliases are only sheet shorthand. Real equipment set names come from HoYoWiki.
  const ALIASES = new Map([
    ["Dr레이시오", "레이시오"],
    ["블랙스완", "블랙스완"],
    ["완매", "완매"],
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
  ]);
  const EQUIPMENT_SET_BY_ITEM_KEY = new Map([
    [6102, { label: "거너", aliases: ["거너"] }],
    [6108, { label: "천재", aliases: ["천재", "지니어스"] }],
    [6110, { label: "매", aliases: ["매"] }],
    [6111, { label: "괴도", aliases: ["괴도"] }],
    [6113, { label: "제자", aliases: ["제자"] }],
    [6114, { label: "메신저", aliases: ["메신저"] }],
    [6115, { label: "대공", aliases: ["대공"] }],
    [6116, { label: "죄수", aliases: ["죄수"] }],
    [6117, { label: "선구자", aliases: ["선구자"] }],
    [6118, { label: "시계공", aliases: ["시계공"] }],
    [6119, { label: "철기군", aliases: ["철기군"] }],
    [6120, { label: "용맹", aliases: ["용맹", "현효"] }],
    [6121, { label: "사제", aliases: ["사제"] }],
    [6122, { label: "학자", aliases: ["학자"] }],
    [6124, { label: "시인", aliases: ["시인"] }],
    [6125, { label: "여전사", aliases: ["여전사"] }],
    [6126, { label: "선장", aliases: ["선장"] }],
    [6127, { label: "구세주", aliases: ["구세주"] }],
    [6128, { label: "은둔자", aliases: ["은둔자"] }],
    [6129, { label: "마법소녀", aliases: ["마법소녀", "마법 소녀"] }],
    [6130, { label: "점술가", aliases: ["점술가"] }],
    [6306, { label: "살소토", aliases: ["살소토"] }],
    [6308, { label: "바커공", aliases: ["바커공", "바커 공"] }],
    [6309, { label: "뭇별 경기장", aliases: ["뭇별", "뭇별 경기장"] }],
    [6310, { label: "부러진 용골", aliases: ["부러진 용골", "용골"] }],
    [6314, { label: "이즈모", aliases: ["이즈모"] }],
    [6315, { label: "도람", aliases: ["도람"] }],
    [6316, { label: "연마궁", aliases: ["연마궁"] }],
    [6317, { label: "루샤카", aliases: ["루샤카"] }],
    [6318, { label: "나나 낙원", aliases: ["나나 낙원", "낙원"] }],
    [6319, { label: "습골지", aliases: ["습골지", "아이도니아"] }],
    [6320, { label: "앰포리어스", aliases: ["앰포리어스", "깨달음"] }],
    [6322, { label: "노래", aliases: ["노래"] }],
    [6325, { label: "펑크 로드", aliases: ["펑크 로드"] }],
  ]);
  const EQUIPMENT_SET_BY_WIKI_ENTRY = new Map([
    [135, EQUIPMENT_SET_BY_ITEM_KEY.get(6110)],
    [137, EQUIPMENT_SET_BY_ITEM_KEY.get(6308)],
    [138, EQUIPMENT_SET_BY_ITEM_KEY.get(6111)],
    [139, EQUIPMENT_SET_BY_ITEM_KEY.get(6102)],
    [145, EQUIPMENT_SET_BY_ITEM_KEY.get(6108)],
    [1235, EQUIPMENT_SET_BY_ITEM_KEY.get(6310)],
    [1236, EQUIPMENT_SET_BY_ITEM_KEY.get(6113)],
    [1237, EQUIPMENT_SET_BY_ITEM_KEY.get(6114)],
    [1238, EQUIPMENT_SET_BY_ITEM_KEY.get(6309)],
    [1600, EQUIPMENT_SET_BY_ITEM_KEY.get(6116)],
    [1601, EQUIPMENT_SET_BY_ITEM_KEY.get(6115)],
    [1925, EQUIPMENT_SET_BY_ITEM_KEY.get(6117)],
    [1926, EQUIPMENT_SET_BY_ITEM_KEY.get(6118)],
    [2372, EQUIPMENT_SET_BY_ITEM_KEY.get(6314)],
    [2649, EQUIPMENT_SET_BY_ITEM_KEY.get(6119)],
    [2650, EQUIPMENT_SET_BY_ITEM_KEY.get(6315)],
    [2651, EQUIPMENT_SET_BY_ITEM_KEY.get(6316)],
    [2655, EQUIPMENT_SET_BY_ITEM_KEY.get(6120)],
    [3059, EQUIPMENT_SET_BY_ITEM_KEY.get(6318)],
    [3064, EQUIPMENT_SET_BY_ITEM_KEY.get(6317)],
    [3161, EQUIPMENT_SET_BY_ITEM_KEY.get(6122)],
    [3162, EQUIPMENT_SET_BY_ITEM_KEY.get(6121)],
    [3343, EQUIPMENT_SET_BY_ITEM_KEY.get(6124)],
    [3565, EQUIPMENT_SET_BY_ITEM_KEY.get(6320)],
    [3566, EQUIPMENT_SET_BY_ITEM_KEY.get(6319)],
    [3782, EQUIPMENT_SET_BY_ITEM_KEY.get(6126)],
    [3783, EQUIPMENT_SET_BY_ITEM_KEY.get(6125)],
    [3904, EQUIPMENT_SET_BY_ITEM_KEY.get(6322)],
    [4012, EQUIPMENT_SET_BY_ITEM_KEY.get(6127)],
    [4013, EQUIPMENT_SET_BY_ITEM_KEY.get(6128)],
    [4769, EQUIPMENT_SET_BY_ITEM_KEY.get(6130)],
    [4770, EQUIPMENT_SET_BY_ITEM_KEY.get(6129)],
    [5012, EQUIPMENT_SET_BY_ITEM_KEY.get(6325)],
  ]);
  let sheetCharactersCache = null;
  let wikiEquipmentSetsCache = null;
  let languageWarningShown = false;

  // Shared low-level helpers.
  function addUnique(list, value) {
    if (value && !list.includes(value)) {
      list.push(value);
    }
  }

  function getUrl(input) {
    if (typeof input === "string") {
      return input;
    }

    if (input && typeof input.url === "string") {
      return input.url;
    }

    return "";
  }

  function isLikelyImageUrl(value) {
    return /^(?:https?:)?\/\//i.test(value) &&
      (
        /\.(?:png|webp|jpg|jpeg)(?:\?|$)/i.test(value) ||
        value.includes("act-webstatic.hoyoverse.com") ||
        value.includes("act-upload.hoyoverse.com")
      );
  }

  function normalizeImageUrl(value) {
    return value.startsWith("//") ? `${window.location.protocol}${value}` : value;
  }

  function getImageUrl(source, depth = 0, seen = new Set()) {
    if (!source || depth > 3) {
      return "";
    }

    if (typeof source === "string") {
      return isLikelyImageUrl(source) ? normalizeImageUrl(source) : "";
    }

    if (typeof source !== "object" || seen.has(source)) {
      return "";
    }

    seen.add(source);

    const preferredKeys = [
      "icon",
      "icon_url",
      "iconUrl",
      "image",
      "image_url",
      "imageUrl",
      "item_icon",
      "itemIcon",
      "avatar_icon",
      "avatarIcon",
      "portrait",
      "portrait_url",
      "portraitUrl",
      "head_icon",
      "headIcon",
    ];

    for (const key of preferredKeys) {
      const value = source[key];
      const url = getImageUrl(value, depth + 1, seen);

      if (url) {
        return url;
      }
    }

    for (const [key, value] of Object.entries(source)) {
      if (!/(?:icon|image|avatar|portrait|head|figure|thumb|url)/i.test(key)) {
        continue;
      }

      const url = getImageUrl(value, depth + 1, seen);

      if (url) {
        return url;
      }
    }

    return "";
  }

  function isTarget(url) {
    return TARGETS.some((target) => url.includes(target));
  }

  function parseJson(text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

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

  // Sheet CSV parsing keeps merged-cell workarounds close to sheet-specific code.
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

  // Character name resolution is separate from build/equipment comparison.
  function normalizeName(value) {
    return String(value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, "")
      .replace(/[·.•.]/g, "")
      .trim();
  }

  function resolveSheetName(character, sheetByNormalizedName) {
    const normalized = normalizeName(character.name);
    const alias = ALIASES.get(normalized);

    if (alias) {
      return alias;
    }

    if (normalized === "개척자") {
      const suffix = PATH_SUFFIX_BY_BASE_TYPE.get(character.base_type);
      return suffix ? `개척자•${suffix}` : null;
    }

    if (normalized === "Mar7th") {
      const suffix = PATH_SUFFIX_BY_BASE_TYPE.get(character.base_type);
      return suffix ? `Mar.7•${suffix}` : null;
    }

    return sheetByNormalizedName.get(normalized)?.name || null;
  }

  function getLatestDetailData() {
    const responses = window.__JALKIWOTDA_HSR_RESPONSES__;

    for (let index = responses.length - 1; index >= 0; index -= 1) {
      const response = responses[index];

      if (response.url.includes("/hkrpg/api/avatar/info")) {
        return response.body?.data || null;
      }
    }

    return null;
  }

  function requestSheetTextFromExtension() {
    return new Promise((resolve, reject) => {
      const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const timeoutId = window.setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        reject(new Error("Sheet request timed out"));
      }, 10000);

      function handleMessage(event) {
        if (event.source !== window) {
          return;
        }

        if (
          event.data?.type !== "JALKIWOTDA_HSR_SHEET_RESPONSE" ||
          event.data.requestId !== requestId
        ) {
          return;
        }

        window.clearTimeout(timeoutId);
        window.removeEventListener("message", handleMessage);

        if (event.data.ok) {
          resolve(event.data.text || "");
          return;
        }

        reject(new Error(event.data.error || "Sheet request failed"));
      }

      window.addEventListener("message", handleMessage);
      window.postMessage(
        { type: "JALKIWOTDA_HSR_SHEET_REQUEST", requestId },
        window.location.origin,
      );
    });
  }

  async function loadSheetText() {
    try {
      return await requestSheetTextFromExtension();
    } catch (error) {
      console.warn("[jalkiwotda-hsr] extension sheet bridge failed, falling back to fetch", error);
    }

    const response = await fetch(SHEET_URL);
    return response.text();
  }

  async function loadSheetCharacters() {
    if (sheetCharactersCache) {
      return sheetCharactersCache;
    }

    if (!SHEET_URL) {
      throw new Error("Sheet URL is not configured");
    }

    const text = await loadSheetText();
    sheetCharactersCache = parseSheetRows(parseCsv(text.replace(/^\uFEFF/, "")));
    return sheetCharactersCache;
  }

  // HoYoWiki aggregate 108 is the source of truth for equipment set names.
  async function fetchWikiSetPage(pageNum) {
    const response = await fetch(WIKI_SET_LIST_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rpc-language": "ko-kr",
        "x-rpc-wiki_app": "hsr",
      },
      body: JSON.stringify({
        filters: [],
        menu_id: WIKI_RELIC_SET_MENU_ID,
        page_num: pageNum,
        page_size: WIKI_PAGE_SIZE,
        use_es: true,
      }),
    });
    const payload = await response.json();

    if (payload.retcode !== 0) {
      throw new Error(`HoYoWiki set list failed: ${payload.message || payload.retcode}`);
    }

    return payload.data || {};
  }

  async function loadWikiEquipmentSets() {
    if (wikiEquipmentSetsCache) {
      return wikiEquipmentSetsCache;
    }

    const firstPage = await fetchWikiSetPage(1);
    const total = Number(firstPage.total || 0);
    const pages = Math.max(1, Math.ceil(total / WIKI_PAGE_SIZE));
    const list = [...(firstPage.list || [])];

    for (let pageNum = 2; pageNum <= pages; pageNum += 1) {
      const page = await fetchWikiSetPage(pageNum);
      list.push(...(page.list || []));
    }

    wikiEquipmentSetsCache = new Map(
      list
        .map((entry) => [Number(entry.entry_page_id), cleanCell(entry.name)])
        .filter(([id, name]) => id && name),
    );

    return wikiEquipmentSetsCache;
  }

  // Text comparison normalizes Korean shorthand used in the sheet.
  function normalizeCompareText(value) {
    return cleanCell(value)
      .toLowerCase()
      .replace(/\([^)]*\)/g, "")
      .replace(/치확/g, "치명타확률")
      .replace(/치피/g, "치명타피해")
      .replace(/효명/g, "효과명중")
      .replace(/효저/g, "효과저항")
      .replace(/격특/g, "격파특수효과")
      .replace(/에충/g, "에너지회복효율")
      .replace(/충전/g, "회복")
      .replace(/증가|보너스|속성/g, "")
      .replace(/[,\s·.•.~/+_-]/g, "")
      .trim();
  }

  function splitExpectedOptions(values) {
    return values
      .flatMap((value) => cleanCell(value).split(/\n+/))
      .flatMap((value) => {
        const normalized = normalizeCompareText(value);

        if (normalized.includes("고민그리고행복")) {
          return [value];
        }

        return value.split(/\s*,\s*/);
      })
      .map((value) => cleanCell(value))
      .filter((value) => value && !value.startsWith("("));
  }

  function compareText(actual, expectedValues) {
    const options = splitExpectedOptions(expectedValues);

    if (options.length === 0) {
      return { status: "unknown", matched: null };
    }

    const actualText = normalizeCompareText(actual);

    if (!actualText) {
      return { status: "unknown", matched: null };
    }

    if (options.some((option) => normalizeCompareText(option) === "아무거나")) {
      return { status: "ok", matched: "아무거나" };
    }

    const matched = options.find((option) => {
      const expectedText = normalizeCompareText(option);
      return expectedText && (
        actualText.includes(expectedText) || expectedText.includes(actualText)
      );
    });

    return matched
      ? { status: "ok", matched }
      : { status: actualText ? "bad" : "unknown", matched: null };
  }

  function getPropertyName(propertyInfo, property) {
    if (!property) {
      return "";
    }

    return cleanCell(propertyInfo[property.property_type]?.name || String(property.property_type));
  }

  function getWikiEntryId(item, relicWiki) {
    const url = relicWiki?.[item?.id];
    const match = String(url || "").match(/\/entry\/(\d+)/);
    return match ? Number(match[1]) : null;
  }

  function getSetKey(item, relicWiki) {
    const wikiEntryId = getWikiEntryId(item, relicWiki);

    if (wikiEntryId) {
      return `wiki:${wikiEntryId}`;
    }

    const id = Number(item?.id || 0);

    if (!id) {
      return "";
    }

    return `item:${Math.floor(id / 10)}`;
  }

  function getSetInfo(item, relicWiki, wikiSetNames) {
    const wikiEntryId = getWikiEntryId(item, relicWiki);

    if (wikiEntryId && wikiSetNames?.has(wikiEntryId)) {
      const label = wikiSetNames.get(wikiEntryId);
      const staticInfo = EQUIPMENT_SET_BY_WIKI_ENTRY.get(wikiEntryId);
      return {
        label,
        aliases: [label, ...(staticInfo?.aliases || [])],
      };
    }

    if (wikiEntryId && EQUIPMENT_SET_BY_WIKI_ENTRY.has(wikiEntryId)) {
      return EQUIPMENT_SET_BY_WIKI_ENTRY.get(wikiEntryId);
    }

    return EQUIPMENT_SET_BY_ITEM_KEY.get(Math.floor(Number(item?.id || 0) / 10));
  }

  function getSetAliasFromItemName(item) {
    const name = cleanCell(item?.name || "");
    const possessiveIndex = name.indexOf("의 ");

    if (possessiveIndex > 0) {
      return name.slice(0, possessiveIndex);
    }

    return name;
  }

  function summarizeSets(items, relicWiki, wikiSetNames) {
    const groups = new Map();

    for (const item of items || []) {
      const key = getSetKey(item, relicWiki);

      if (!key) {
        continue;
      }

      const setInfo = getSetInfo(item, relicWiki, wikiSetNames);
      const wikiEntryId = getWikiEntryId(item, relicWiki);
      const itemKey = Math.floor(Number(item?.id || 0) / 10);
      const dataAlias = getSetAliasFromItemName(item);
      const aliases = setInfo?.aliases ? [...setInfo.aliases] : [];

      addUnique(aliases, dataAlias);

      const group = groups.get(key) || {
        key,
        label: setInfo?.label || dataAlias || `미매핑 ${key}`,
        aliases,
        dataAliases: setInfo ? [] : (dataAlias ? [dataAlias] : []),
        known: Boolean(setInfo),
        wikiEntryId,
        wikiUrl: relicWiki?.[item?.id] || "",
        itemKey,
        iconUrl: getImageUrl(item),
        count: 0,
      };

      addUnique(group.aliases, dataAlias);

      if (!group.iconUrl) {
        group.iconUrl = getImageUrl(item);
      }

      if (!setInfo && dataAlias && !group.dataAliases.includes(dataAlias)) {
        group.dataAliases.push(dataAlias);
        addUnique(group.aliases, dataAlias);
      }

      group.count += 1;
      groups.set(key, group);
    }

    return Array.from(groups.values());
  }

  function compareSetGroups(actualGroups, expectedValues) {
    const expected = splitExpectedOptions(expectedValues);

    if (expected.length === 0) {
      return { status: "unknown", matched: null };
    }

    const actualNames = actualGroups.flatMap((group) =>
      (group.aliases.length ? group.aliases : [group.label]).map((name) => normalizeCompareText(name)),
    );
    const matched = expected.find((entry) => {
      const requiredParts = entry
        .split(/\s*\+\s*/)
        .map((part) => normalizeCompareText(part))
        .filter(Boolean);

      if (requiredParts.length === 0) {
        return false;
      }

      return requiredParts.every((part) =>
        actualNames.some((actual) => actual.includes(part) || part.includes(actual)),
      );
    });

    return matched
      ? { status: "ok", matched }
      : {
          status: actualGroups.length === 0 ||
            actualGroups.some((group) => !group.known && group.dataAliases.length === 0)
            ? "unknown"
            : "bad",
          matched: null,
        };
  }

  function formatSetGroups(groups) {
    return groups.length
      ? groups.map((group) => `${group.label} x${group.count}`).join(", ")
      : "-";
  }

  function formatSetGroupsHtml(groups) {
    return groups.length
      ? groups
          .map((group) =>
            `${renderInlineIcon(group.iconUrl, ITEM_ICON_STYLE)}${escapeHtml(group.label)} x${escapeHtml(group.count)}`,
          )
          .join("<br>")
      : "-";
  }

  function getBuildData(character, propertyInfo, relicWiki, wikiSetNames) {
    const relics = character.relics || [];
    const ornaments = character.ornaments || [];
    const itemsByPos = new Map(
      [...relics, ...ornaments].map((item) => [item.pos, item]),
    );
    const mainStats = {
      body: getPropertyName(propertyInfo, itemsByPos.get(3)?.main_property),
      feet: getPropertyName(propertyInfo, itemsByPos.get(4)?.main_property),
      sphere: getPropertyName(propertyInfo, itemsByPos.get(5)?.main_property),
      rope: getPropertyName(propertyInfo, itemsByPos.get(6)?.main_property),
    };

    return {
      lightCone: cleanCell(character.equip?.name || ""),
      lightConeIcon: getImageUrl(character.equip),
      relicSets: summarizeSets(relics, relicWiki, wikiSetNames),
      ornamentSets: summarizeSets(ornaments, relicWiki, wikiSetNames),
      mainStats,
    };
  }

  // Variant scoring strongly prefers matching set recommendations before main stats.
  function compareVariant(build, variant) {
    const checks = {
      lightCone: compareText(build.lightCone, variant.lightCones || []),
      relicSets: compareSetGroups(build.relicSets, variant.relicSets || []),
      ornamentSets: compareSetGroups(build.ornamentSets, variant.ornamentSets || []),
      body: compareText(build.mainStats.body, variant.mainStats?.body || []),
      feet: compareText(build.mainStats.feet, variant.mainStats?.feet || []),
      sphere: compareText(build.mainStats.sphere, variant.mainStats?.sphere || []),
      rope: compareText(build.mainStats.rope, variant.mainStats?.rope || []),
    };
    const score = Object.entries(checks).reduce((total, [key, check]) => {
      const weight = CHECK_WEIGHTS[key] || 1;

      if (check.status === "ok") {
        return total + (2 * weight);
      }

      if (check.status === "bad") {
        return total - weight;
      }

      return total;
    }, 0);
    const matchedSetCount = [checks.relicSets, checks.ornamentSets]
      .filter((check) => check.status === "ok").length;
    const matchedMainStatCount = [checks.body, checks.feet, checks.sphere, checks.rope]
      .filter((check) => check.status === "ok").length;

    return { variant, checks, score, matchedSetCount, matchedMainStatCount };
  }

  function pickBestComparison(build, variants) {
    return (variants || [])
      .map((variant) => compareVariant(build, variant))
      .sort((left, right) =>
        right.score - left.score ||
        right.matchedSetCount - left.matchedSetCount ||
        right.matchedMainStatCount - left.matchedMainStatCount,
      )[0] || null;
  }

  function parseNumber(value) {
    const match = String(value || "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
  }

  function getNumericProperty(properties, propertyName) {
    const value = properties[propertyName];
    return value ? parseNumber(value) : null;
  }

  function resolveTargetProperty(line) {
    const normalized = normalizeCompareText(line);

    if (normalized.includes("hp")) {
      return "HP";
    }

    if (normalized.includes("공격력") || /^공\d/.test(normalized) || normalized.startsWith("공")) {
      return "공격력";
    }

    if (normalized.includes("방어")) {
      return "방어력";
    }

    if (normalized.includes("속도")) {
      return "속도";
    }

    if (normalized.includes("치명타확률")) {
      return "치명타 확률";
    }

    if (normalized.includes("치명타피해")) {
      return "치명타 피해";
    }

    if (normalized.includes("효과명중")) {
      return "효과 명중";
    }

    if (normalized.includes("효과저항")) {
      return "효과 저항";
    }

    if (normalized.includes("격파특수효과")) {
      return "격파 특수효과";
    }

    if (normalized.includes("에너지회복효율")) {
      return "에너지 회복효율";
    }

    return null;
  }

  function resolveTargetOperator(line) {
    const text = cleanCell(line);

    if (/[↓<]/.test(text) || /미만|이하|낮/.test(text)) {
      return "max";
    }

    return "min";
  }

  function compareStatValue(actual, target, operator) {
    if (actual === null || target === null) {
      return "unknown";
    }

    return operator === "max"
      ? (actual <= target ? "ok" : "bad")
      : (actual >= target ? "ok" : "bad");
  }

  function summarizeCheckStatus(checks) {
    if (checks.length === 0) {
      return "unknown";
    }

    if (checks.some((check) => check.status === "bad")) {
      return "bad";
    }

    if (checks.some((check) => check.status === "unknown")) {
      return "unknown";
    }

    return "ok";
  }

  function compareStatTarget(properties, targetText) {
    const lines = cleanCell(targetText).split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const checks = [];

    for (const line of lines) {
      const propertyName = resolveTargetProperty(line);
      const target = parseNumber(line);

      if (!propertyName || target === null) {
        if (checks.length > 0) {
          const previous = checks[checks.length - 1];
          previous.notes = [...(previous.notes || []), line];
        }
        continue;
      }

      const actual = getNumericProperty(properties, propertyName);
      const operator = resolveTargetOperator(line);

      checks.push({
        label: line,
        propertyName,
        actual,
        target,
        operator,
        status: compareStatValue(actual, target, operator),
      });
    }

    return { status: summarizeCheckStatus(checks), checks };
  }

  function compareCritTarget(properties, targetText) {
    const text = cleanCell(targetText);
    const numbers = Array.from(text.matchAll(/\d+(?:\.\d+)?/g)).map((match) => Number(match[0]));

    if (!text) {
      return { status: text ? "unknown" : "unknown", checks: [] };
    }

    const critRate = getNumericProperty(properties, "치명타 확률");
    const critDamage = getNumericProperty(properties, "치명타 피해");
    let checks = [];

    if (numbers.length >= 2) {
      checks = [
        {
          label: `치확 ${numbers[0]}`,
          propertyName: "치명타 확률",
          actual: critRate,
          target: numbers[0],
          operator: "min",
          status: compareStatValue(critRate, numbers[0], "min"),
        },
        {
          label: `치피 ${numbers[1]}`,
          propertyName: "치명타 피해",
          actual: critDamage,
          target: numbers[1],
          operator: "min",
          status: compareStatValue(critDamage, numbers[1], "min"),
        },
      ];
    } else {
      const propertyName = resolveTargetProperty(text);
      const target = numbers[0] ?? null;
      const actual = propertyName === "치명타 확률"
        ? critRate
        : propertyName === "치명타 피해"
          ? critDamage
          : null;

      if (propertyName && target !== null) {
        checks = [
          {
            label: text,
            propertyName,
            actual,
            target,
            operator: "min",
            status: compareStatValue(actual, target, "min"),
          },
        ];
      }
    }

    return { status: summarizeCheckStatus(checks), checks };
  }

  function applySelectedVariant(row, variantIndex) {
    const fallbackComparison = row.comparisons?.find(Boolean) || row.comparison || null;
    const comparison = row.comparisons?.[variantIndex] || fallbackComparison;
    const variant = comparison?.variant ||
      row.variants?.[variantIndex] ||
      row.variants?.find((candidate) => cleanCell(candidate.role)) ||
      row.variants?.[0] ||
      {};

    row.selectedVariantIndex = Math.max(0, variantIndex);
    row.comparison = comparison;
    row.statComparison = compareStatTarget(row.properties, variant.statTarget || "");
    row.critComparison = compareCritTarget(row.properties, variant.critTarget || "");
    return row;
  }

  function buildReportRows(detailData, sheetCharacters, wikiSetNames = new Map()) {
    const propertyInfo = detailData.property_info || {};
    const relicWiki = detailData.relic_wiki || {};
    const sheetByNormalizedName = new Map(
      sheetCharacters.map((character) => [normalizeName(character.name), character]),
    );

    return (detailData.avatar_list || []).map((character, rowIndex) => {
      const sheetName = resolveSheetName(character, sheetByNormalizedName);
      const sheet = sheetName ? sheetByNormalizedName.get(normalizeName(sheetName)) : null;
      const properties = Object.fromEntries(
        (character.properties || []).map((property) => [
          cleanCell(propertyInfo[property.property_type]?.name || String(property.property_type)),
          property.final,
        ]),
      );
      const build = getBuildData(character, propertyInfo, relicWiki, wikiSetNames);
      const variants = (sheet?.variants || []).filter((variant) => cleanCell(variant.role));
      const comparisons = variants.map((variant) => compareVariant(build, variant));
      const comparison = pickBestComparison(build, variants);
      const selectedVariantIndex = Math.max(
        0,
        comparisons.findIndex((candidate) => candidate?.variant === comparison?.variant),
      );

      return applySelectedVariant({
        id: character.id,
        rowIndex,
        name: cleanCell(character.name),
        iconUrl: getImageUrl(character),
        level: character.level,
        rank: character.rank,
        sheetName,
        matched: Boolean(sheet),
        properties,
        build,
        comparisons,
        variants,
      }, selectedVariantIndex);
    });
  }

  function getReportTotals(rows) {
    return rows.reduce(
      (accumulator, row) => {
        Object.values(row.comparison?.checks || {}).forEach((check) => {
          accumulator[check.status] += 1;
        });
        [row.statComparison, row.critComparison].forEach((check) => {
          accumulator[check.status] += 1;
        });
        return accumulator;
      },
      { ok: 0, bad: 0, unknown: 0 },
    );
  }

  function getUnmappedSets(rows) {
    const sets = [];

    for (const row of rows) {
      for (const group of [...row.build.relicSets, ...row.build.ornamentSets]) {
        if (
          !group.known &&
          group.dataAliases.length === 0 &&
          !sets.some((set) => set.key === group.key)
        ) {
          sets.push(group);
        }
      }
    }

    return sets;
  }

  function renderInlineIcon(url, style = INLINE_STAT_ICON_STYLE) {
    return url ? `<img src="${escapeHtml(url)}" alt="" style="${style}">` : "";
  }

  function renderDisplayStats(properties) {
    const stats = [
      { value: properties.HP, iconUrl: HP_ICON_URL },
      { value: properties.공격력, iconUrl: ATK_ICON_URL },
      { value: properties.방어력, iconUrl: DEF_ICON_URL },
      { value: properties.속도, iconUrl: SPD_ICON_URL },
      { value: properties["치명타 확률"], iconUrl: CRIT_RATE_ICON_URL },
      { value: properties["치명타 피해"], iconUrl: CRIT_DMG_ICON_URL },
      { value: properties["격파 특수효과"], iconUrl: BREAK_ICON_URL },
      { value: properties["효과 명중"], iconUrl: EHR_ICON_URL },
      { value: properties["에너지 회복효율"], iconUrl: ERR_ICON_URL },
      { value: properties["치유량 보너스"], iconUrl: HEAL_ICON_URL },
    ].filter((stat) => stat.value);

    return stats
      .map((stat) =>
        `<span style="white-space:nowrap;">${renderInlineIcon(stat.iconUrl)}${escapeHtml(stat.value)}</span>`,
      )
      .join("<br>");
  }

  function getPropertyIconUrl(propertyName) {
    const normalized = normalizeCompareText(propertyName);

    if (normalized === "hp") {
      return HP_ICON_URL;
    }

    if (normalized.includes("공격력")) {
      return ATK_ICON_URL;
    }

    if (normalized.includes("방어력")) {
      return DEF_ICON_URL;
    }

    if (normalized.includes("속도")) {
      return SPD_ICON_URL;
    }

    if (normalized.includes("치명타확률")) {
      return CRIT_RATE_ICON_URL;
    }

    if (normalized.includes("치명타피해")) {
      return CRIT_DMG_ICON_URL;
    }

    if (normalized.includes("격파특수효과")) {
      return BREAK_ICON_URL;
    }

    if (normalized.includes("효과명중")) {
      return EHR_ICON_URL;
    }

    if (normalized.includes("에너지회복효율")) {
      return ERR_ICON_URL;
    }

    if (normalized.includes("치유량")) {
      return HEAL_ICON_URL;
    }

    return "";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getStatusLabel(status) {
    if (status === "ok") {
      return "적합";
    }

    if (status === "bad") {
      return "확인";
    }

    return "?";
  }

  function getStatusColor(status) {
    if (status === "ok") {
      return "#64d68a";
    }

    if (status === "bad") {
      return "#ff7c7c";
    }

    return "#d4b05f";
  }

  function renderBadge(check) {
    return [
      `<span style="display:inline-block;min-width:34px;color:${getStatusColor(check?.status)};font-weight:700;flex:none;">`,
      getStatusLabel(check?.status),
      "</span>",
    ].join("");
  }

  function renderExpectedText(values) {
    const value = (values || []).filter(Boolean).join(" / ");
    return value
      ? `<small style="display:block;margin-left:40px;color:#aab4c3;">(${escapeHtml(value)})</small>`
      : "";
  }

  function renderOptionLine(
    label,
    actual,
    check,
    expectedValues,
    iconUrl = getPropertyIconUrl(actual),
    iconStyle = INLINE_STAT_ICON_STYLE,
  ) {
    return [
      "<div>",
      '<div style="display:flex;align-items:center;gap:6px;">',
      renderBadge(check),
      `<span style="display:inline-block;min-width:36px;flex:none;">${escapeHtml(label)}:</span>`,
      renderInlineIcon(iconUrl, iconStyle),
      `<span>${escapeHtml(actual || "-")}</span>`,
      "</div>",
      renderExpectedText(expectedValues),
      "</div>",
    ].join("");
  }

  function renderOptionHtmlLine(label, actualHtml, check, expectedValues) {
    return [
      "<div>",
      '<div style="display:flex;align-items:flex-start;gap:6px;">',
      renderBadge(check),
      `<span style="display:inline-block;min-width:42px;flex:none;">${escapeHtml(label)}:</span>`,
      `<span>${actualHtml || "-"}</span>`,
      "</div>",
      renderExpectedText(expectedValues),
      "</div>",
    ].join("");
  }

  function renderStatCheckLine(check) {
    const operator = check.operator === "max" ? "<=" : ">=";
    const notes = check.notes?.length
      ? `<small style="display:block;margin-left:40px;color:#d4b05f;white-space:nowrap;">${escapeHtml(check.notes.join(" / "))}</small>`
      : "";

    return [
      "<div>",
      '<div style="display:flex;align-items:center;gap:6px;">',
      renderBadge(check),
      renderInlineIcon(getPropertyIconUrl(check.propertyName)),
      `<span style="white-space:nowrap;">${escapeHtml(check.propertyName)}: ${escapeHtml(check.actual ?? "-")}</span>`,
      "</div>",
      `<small style="display:block;margin-left:40px;color:#aab4c3;white-space:nowrap;">${escapeHtml(operator)} ${escapeHtml(check.target)} (${escapeHtml(check.label)})</small>`,
      notes,
      "</div>",
    ].join("");
  }

  function renderStatBlock(comparison, fallbackText) {
    if (comparison?.checks?.length) {
      return comparison.checks.map(renderStatCheckLine).join("");
    }

    return `${renderBadge(comparison)}${escapeHtml(fallbackText || "-")}`;
  }

  function renderStatIcon(style = STAT_ICON_STYLE) {
    return STAT_ICON_URL
      ? `<img src="${escapeHtml(STAT_ICON_URL)}" alt="" style="${style}">`
      : "";
  }

  function getSheetPageUrl() {
    return SHEET_URL.replace(/\/export\?.*$/, "/edit?gid=0");
  }

  function formatEidolon(rank) {
    const value = Number(rank);

    if (value === 0) {
      return "명함";
    }

    if (Number.isFinite(value)) {
      return `${value}돌`;
    }

    return `${rank}돌`;
  }

  function getPageLanguage() {
    return cleanCell(
      document.documentElement?.lang ||
        document.querySelector("html")?.getAttribute("lang") ||
        "",
    ).toLowerCase();
  }

  function isKoreanPageLanguage() {
    const language = getPageLanguage();
    return !language || language.startsWith("ko");
  }

  function isLikelyKoreanCharacterData(detailData) {
    const avatar = detailData?.avatar_list?.find((item) => cleanCell(item?.name));
    const propertyInfo = detailData?.property_info || {};
    const propertyNames = Object.values(propertyInfo)
      .map((property) => cleanCell(property?.name))
      .filter(Boolean);
    const sampleText = [avatar?.name, ...propertyNames.slice(0, 8)].join(" ");

    return /[가-힣]/.test(sampleText);
  }

  function shouldRequireKoreanLanguage(detailData) {
    return !isKoreanPageLanguage() || !isLikelyKoreanCharacterData(detailData);
  }

  function alertKoreanLanguageRequired() {
    languageWarningShown = true;
    alert(
      "HoYoLAB 언어가 한국어가 아니면 캐릭터 이름과 스탯명이 영어로 들어와 기준표와 매칭되지 않습니다.\n\nHoYoLAB 언어를 한국어로 바꾼 뒤 페이지를 새로고침해 주세요.",
    );
  }

  function renderUnmappedSets(sets) {
    if (!sets.length) {
      return "";
    }

    return `
      <div style="margin-bottom:8px;color:#d4b05f;">
        매핑되지 않은 세트:
        ${sets.map((set) =>
          `${escapeHtml(set.key)} 항목:${escapeHtml(set.itemKey || "")}${set.wikiUrl ? ` <a style="color:#8ab4ff;" href="${escapeHtml(set.wikiUrl)}" target="_blank" rel="noreferrer">위키</a>` : ""}`,
        ).join(" · ")}
      </div>
    `;
  }

  function renderVariantList(row, selectedVariant) {
    if (!row.variants.length) {
      return "";
    }

    return `
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;color:#aab4c3;font-size:11px;">
        <strong style="color:#d7dee8;">기준 세팅</strong>
        ${row.variants.map((variant, index) => {
          if (!cleanCell(variant.role)) {
            return "";
          }

          const selected = variant === selectedVariant;
          const label = `${index + 1}. ${variant.role}`;
          return `<button type="button" data-jalkiwotda-row-index="${escapeHtml(row.rowIndex)}" data-jalkiwotda-variant-index="${escapeHtml(index)}" style="display:inline-block;padding:2px 5px;border:1px solid ${selected ? "#8ab4ff" : "#5f6b7a"};border-radius:4px;color:${selected ? "#fff" : "#aab4c3"};background:${selected ? "#25324a" : "transparent"};white-space:nowrap;font:inherit;cursor:pointer;">${escapeHtml(label)}</button>`;
        }).join("")}
      </div>
    `;
  }

  function renderReportRow(row) {
    const selectedComparison = row.comparison || {};
    const variant = selectedComparison.variant || row.variants[0] || {};
    const checks = selectedComparison.checks || {};

    return `
      <tr>
        <td>${renderInlineIcon(row.iconUrl, CHARACTER_ICON_STYLE)}${escapeHtml(row.name)}</td>
        <td>Lv.${escapeHtml(row.level)}<br>${escapeHtml(formatEidolon(row.rank))}</td>
        <td>${escapeHtml(variant.role || "")}</td>
        <td>
          ${renderOptionLine("광추", row.build.lightCone, checks.lightCone, variant.lightCones, row.build.lightConeIcon, EQUIPMENT_ICON_STYLE)}
        </td>
        <td>
          ${renderOptionHtmlLine("유물", formatSetGroupsHtml(row.build.relicSets), checks.relicSets, variant.relicSets)}
          ${renderOptionHtmlLine("장신구", formatSetGroupsHtml(row.build.ornamentSets), checks.ornamentSets, variant.ornamentSets)}
        </td>
        <td>
          ${renderOptionLine("몸통", row.build.mainStats.body, checks.body, variant.mainStats?.body)}
          ${renderOptionLine("신발", row.build.mainStats.feet, checks.feet, variant.mainStats?.feet)}
          ${renderOptionLine("구체", row.build.mainStats.sphere, checks.sphere, variant.mainStats?.sphere)}
          ${renderOptionLine("매듭", row.build.mainStats.rope, checks.rope, variant.mainStats?.rope)}
        </td>
        <td>${renderStatBlock(row.statComparison, variant.statTarget)}</td>
        <td>${renderStatBlock(row.critComparison, variant.critTarget)}</td>
        <td>${renderDisplayStats(row.properties)}</td>
      </tr>
      ${row.variants.length
        ? `<tr data-jalkiwotda-settings-row><td colspan="9">${renderVariantList(row, variant)}</td></tr>`
        : ""}
    `;
  }

  function createReportHtml(rows) {
    const unmappedSets = getUnmappedSets(rows);
    const totals = getReportTotals(rows);

    return `
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px;">
        <div>
          <strong style="display:flex;align-items:center;font-size:20px;line-height:1.25;">${renderStatIcon(REPORT_ICON_STYLE)}이잘키 스타레일 정오표</strong>
          <div style="margin-top:6px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <a href="${escapeHtml(getSheetPageUrl())}" target="_blank" rel="noreferrer" style="color:#8ab4ff;font-weight:700;">이잘키 표 열기</a>
            <span style="color:#ffcf70;font-weight:700;">세팅하기 전에 반드시 표를 다시 확인할것.</span>
          </div>
        </div>
        <button type="button" data-jalkiwotda-close-report>닫기</button>
      </div>
      <div style="margin-bottom:8px;">
        매칭 ${rows.filter((row) => row.matched).length}/${rows.length}
        · 적합 ${totals.ok}
        · 확인 ${totals.bad}
        · ? ${totals.unknown}
      </div>
      ${renderUnmappedSets(unmappedSets)}
      <table>
        <thead>
          <tr>
            <th>캐릭터</th>
            <th>레벨</th>
            <th>역할</th>
            <th>광추</th>
            <th>세트</th>
            <th>주 옵션</th>
            <th>스탯 목표</th>
            <th>치명타 목표</th>
            <th>현재 스탯</th>
          </tr>
        </thead>
        <tbody>${rows.map(renderReportRow).join("")}</tbody>
      </table>
    `;
  }

  function renderReportModal(modal, rows) {
    modal.innerHTML = createReportHtml(rows);
    styleReportTable(modal);
    modal.querySelector("[data-jalkiwotda-close-report]").addEventListener("click", () => {
      modal.remove();
    });
    modal.querySelectorAll("[data-jalkiwotda-variant-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const rowIndex = Number(button.dataset.jalkiwotdaRowIndex);
        const variantIndex = Number(button.dataset.jalkiwotdaVariantIndex);
        const row = rows[rowIndex];

        if (!row || !Number.isInteger(variantIndex)) {
          return;
        }

        applySelectedVariant(row, variantIndex);
        renderReportModal(modal, rows);
      });
    });
  }

  async function showReport() {
    const detailData = getLatestDetailData();

    if (!detailData) {
      alert("아직 캐릭터 정보를 가져오지 못했습니다. HoYoLAB 페이지를 새로고침한 뒤 다시 시도하세요.");
      return;
    }

    if (shouldRequireKoreanLanguage(detailData)) {
      alertKoreanLanguageRequired();
      return;
    }

    const sheetCharacters = await loadSheetCharacters();
    let wikiSetNames = new Map();

    try {
      wikiSetNames = await loadWikiEquipmentSets();
    } catch (error) {
      console.warn("[jalkiwotda-hsr] HoYoWiki set list load failed", error);
    }

    const rows = buildReportRows(detailData, sheetCharacters, wikiSetNames);
    const modal = getOrCreateReportModal();

    renderReportModal(modal, rows);
  }

  function getOrCreateReportModal() {
    let modal = document.getElementById("jalkiwotda-hsr-report-modal");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "jalkiwotda-hsr-report-modal";
      modal.style.cssText = MODAL_STYLE;
      document.body.appendChild(modal);
    }

    return modal;
  }

  function styleReportTable(modal) {
    modal.querySelector("table").style.cssText = TABLE_STYLE;
    modal.querySelectorAll("th,td").forEach((cell) => {
      cell.style.cssText = TABLE_CELL_STYLE;
    });
    modal.querySelectorAll("[data-jalkiwotda-settings-row] td").forEach((cell) => {
      cell.style.background = "#151b26";
      cell.style.padding = "5px 6px 8px";
    });
    modal.querySelectorAll("th:nth-child(3),td:nth-child(3)").forEach((cell) => {
      cell.style.minWidth = "90px";
    });
    modal.querySelectorAll("th:nth-child(4),td:nth-child(4)").forEach((cell) => {
      cell.style.width = "240px";
      cell.style.minWidth = "240px";
      cell.style.maxWidth = "240px";
      cell.style.whiteSpace = "normal";
      cell.style.wordBreak = "keep-all";
    });
    modal.querySelectorAll("th:nth-child(5),td:nth-child(5)").forEach((cell) => {
      cell.style.minWidth = "220px";
      cell.style.whiteSpace = "normal";
      cell.style.wordBreak = "keep-all";
    });
    modal.querySelectorAll("th:nth-child(7),td:nth-child(7)").forEach((cell) => {
      cell.style.minWidth = "180px";
    });
    modal.querySelectorAll("th:nth-child(8),td:nth-child(8)").forEach((cell) => {
      cell.style.minWidth = "180px";
    });
    modal.querySelectorAll("th:nth-child(9),td:nth-child(9)").forEach((cell) => {
      cell.style.minWidth = "150px";
    });
  }

  function recordResponse(source, url, status, bodyText) {
    if (!isTarget(url)) {
      return;
    }

    const payload = {
      source,
      url,
      status,
      capturedAt: new Date().toISOString(),
      body: parseJson(bodyText),
      rawBody: bodyText,
    };

    window.__JALKIWOTDA_HSR_RESPONSES__.push(payload);
    updatePanel();
    window.dispatchEvent(
      new CustomEvent("jalkiwotda-hsr-response", { detail: payload }),
    );
    window.postMessage(
      { type: "JALKIWOTDA_HSR_RESPONSE", payload },
      window.location.origin,
    );

    console.debug("[jalkiwotda-hsr] captured", source, url, payload.body);
  }

  function getResponseJson() {
    return JSON.stringify(window.__JALKIWOTDA_HSR_RESPONSES__, null, 2);
  }

  function downloadResponses() {
    const blob = new Blob([getResponseJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jalkiwotda-hsr-responses-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyResponses() {
    const text = getResponseJson();

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function clearResponses() {
    window.__JALKIWOTDA_HSR_RESPONSES__ = [];
    updatePanel();
  }

  function updatePanel() {
    const count = window.__JALKIWOTDA_HSR_RESPONSES__.length;
    const countNode = document.querySelector("[data-jalkiwotda-hsr-count]");

    if (countNode) {
      countNode.textContent = String(count);
    }
  }

  function installPanel() {
    if (document.getElementById("jalkiwotda-hsr-hook-panel")) {
      return;
    }

    const panel = document.createElement("div");
    panel.id = "jalkiwotda-hsr-hook-panel";
    panel.style.cssText = PANEL_STYLE;

    panel.innerHTML = [
      REPORT_IMAGE_URL
        ? `<img src="${escapeHtml(REPORT_IMAGE_URL)}" alt="이잘키 스타레일 정오표" data-jalkiwotda-hsr-image>`
        : "",
      '<span data-jalkiwotda-hsr-count-row>불러온 정보: <b data-jalkiwotda-hsr-count>0</b></span>',
      '<button type="button" data-jalkiwotda-hsr-action="report">정오표 보기</button>',
      '<div data-jalkiwotda-hsr-button-row>',
      '<button type="button" data-jalkiwotda-hsr-action="refresh">새로고침</button>',
      "</div>",
    ].join("");

    const panelImage = panel.querySelector("[data-jalkiwotda-hsr-image]");
    const countRow = panel.querySelector("[data-jalkiwotda-hsr-count-row]");
    const buttonRow = panel.querySelector("[data-jalkiwotda-hsr-button-row]");

    if (panelImage) {
      panelImage.style.cssText = PANEL_IMAGE_STYLE;
    }

    countRow.style.cssText = PANEL_COUNT_STYLE;
    buttonRow.style.cssText = PANEL_BUTTON_ROW_STYLE;
    panel.querySelectorAll("button").forEach((button) => {
      button.style.cssText = PANEL_BUTTON_STYLE;
    });

    panel.addEventListener("click", async (event) => {
      const action = event.target?.dataset?.jalkiwotdaHsrAction;

      if (action === "refresh") {
        clearResponses();
        window.location.reload();
      } else if (action === "report") {
        await showReport();
      }
    });

    document.body.appendChild(panel);
    updatePanel();
  }

  function exposeDebugControls() {
    window.__JALKIWOTDA_HSR_DOWNLOAD__ = downloadResponses;
    window.__JALKIWOTDA_HSR_COPY__ = copyResponses;
    window.__JALKIWOTDA_HSR_CLEAR__ = clearResponses;
  }

  function installPanelWhenReady() {
    if (document.body) {
      installPanel();
      return;
    }

    window.addEventListener("DOMContentLoaded", installPanel, { once: true });
  }

  function installFetchHook() {
    if (typeof window.fetch !== "function") {
      return;
    }

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const url = getUrl(args[0]) || response.url || "";

      if (isTarget(url)) {
        response
          .clone()
          .text()
          .then((bodyText) => {
            recordResponse("fetch", url, response.status, bodyText);
          })
          .catch((error) => {
            console.warn("[jalkiwotda-hsr] fetch capture failed", url, error);
          });
      }

      return response;
    };
  }

  function installXhrHook() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function open(method, url, ...rest) {
      this.__jalkiwotdaHsrUrl = String(url || "");
      return originalOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function send(...args) {
      this.addEventListener("loadend", () => {
        const url = this.__jalkiwotdaHsrUrl || this.responseURL || "";

        if (!isTarget(url)) {
          return;
        }

        if (this.responseType && this.responseType !== "text") {
          return;
        }

        recordResponse("xhr", url, this.status, this.responseText || "");
      });

      return originalSend.apply(this, args);
    };
  }

  exposeDebugControls();
  installPanelWhenReady();
  installFetchHook();
  installXhrHook();
})();
