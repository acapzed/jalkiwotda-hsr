const fs = require("node:fs");

const DEFAULT_HOYOLAB_PATH = process.env.JALKIWOTDA_HOYOLAB_JSON || "";

function loadHoyolabResponses(path = DEFAULT_HOYOLAB_PATH) {
  if (!path) {
    throw new Error("HoYoLAB response JSON path is required");
  }

  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function findResponse(responses, endpoint) {
  return responses.find((response) => response.url.includes(endpoint));
}

function loadHoyolabCharacters(path = DEFAULT_HOYOLAB_PATH) {
  const responses = loadHoyolabResponses(path);
  const detail = findResponse(responses, "/hkrpg/api/avatar/info");

  if (!detail?.body?.data?.avatar_list) {
    throw new Error("Could not find /hkrpg/api/avatar/info avatar_list");
  }

  const propertyInfo = detail.body.data.property_info || {};

  return detail.body.data.avatar_list.map((avatar) => ({
    id: avatar.id,
    name: String(avatar.name || "").replace(/\u00a0/g, " ").trim(),
    level: avatar.level,
    rank: avatar.rank,
    rarity: avatar.rarity,
    element: avatar.element,
    path: avatar.base_type,
    equip: avatar.equip || null,
    relics: avatar.relics || [],
    ornaments: avatar.ornaments || [],
    properties: (avatar.properties || []).map((property) => ({
      type: property.property_type,
      name: propertyInfo[property.property_type]?.name || String(property.property_type),
      base: property.base,
      add: property.add,
      final: property.final,
    })),
    raw: avatar,
  }));
}

if (require.main === module) {
  const path = process.argv[2] || DEFAULT_HOYOLAB_PATH;
  const characters = loadHoyolabCharacters(path);
  console.log(JSON.stringify({ count: characters.length, characters }, null, 2));
}

module.exports = {
  loadHoyolabCharacters,
  loadHoyolabResponses,
};
