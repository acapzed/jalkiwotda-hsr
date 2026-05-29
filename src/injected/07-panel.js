(() => {
  const app = window.JALKIWOTDA_HSR;
  if (!app) return;
  const { cleanCell } = app.utils;

  function getPageLanguage() {
    return cleanCell(document.documentElement?.lang || document.querySelector("html")?.getAttribute("lang") || "").toLowerCase();
  }

  function isKoreanPageLanguage() {
    const language = getPageLanguage();
    return !language || language.startsWith("ko");
  }

  function isLikelyKoreanCharacterData(detailData) {
    const avatar = detailData?.avatar_list?.find((item) => cleanCell(item?.name));
    const propertyInfo = detailData?.property_info || {};
    const propertyNames = Object.values(propertyInfo).map((property) => cleanCell(property?.name)).filter(Boolean);
    const sampleText = [avatar?.name, ...propertyNames.slice(0, 8)].join(" ");
    return /[가-힣]/.test(sampleText);
  }

  function shouldRequireKoreanLanguage(detailData) {
    return !isKoreanPageLanguage() || !isLikelyKoreanCharacterData(detailData);
  }

  function alertKoreanLanguageRequired() {
    app.state.languageWarningShown = true;
    alert(
      "HoYoLAB 언어가 한국어가 아니면 캐릭터 이름과 스탯명이 영어로 들어와 기준표와 매칭되지 않습니다.\n\nHoYoLAB 언어를 한국어로 바꾼 뒤 페이지를 새로고침해 주세요.",
    );
  }

  async function showReport() {
    const detailData = app.network.getLatestDetailData();

    if (!detailData) {
      alert("아직 캐릭터 정보를 가져오지 못했습니다. HoYoLAB 페이지를 새로고침한 뒤 다시 시도하세요.");
      return;
    }

    if (shouldRequireKoreanLanguage(detailData)) {
      alertKoreanLanguageRequired();
      return;
    }

    const sheetCharacters = await app.sheet.loadSheetCharacters();
    let wikiSetNames = new Map();

    try {
      wikiSetNames = await app.wiki.loadWikiEquipmentSets();
    } catch (error) {
      console.warn("[jalkiwotda-hsr] HoYoWiki set list load failed", error);
    }

    const rows = app.compare.buildReportRows(detailData, sheetCharacters, wikiSetNames);
    const modal = app.render.getOrCreateReportModal();
    app.render.renderReportModal(modal, rows);
  }

  function updatePanel() {
    const countNode = document.querySelector("[data-jalkiwotda-hsr-count]");
    if (countNode) countNode.textContent = String(app.state.responses.length);
  }

  function installPanel() {
    if (document.getElementById("jalkiwotda-hsr-hook-panel")) return;

    const panel = document.createElement("div");
    panel.id = "jalkiwotda-hsr-hook-panel";
    panel.style.cssText = app.styles.panel;

    panel.innerHTML = [
      app.config.reportImageUrl
        ? `<img src="${app.utils.escapeHtml(app.config.reportImageUrl)}" alt="이잘키 스타레일 정오표" data-jalkiwotda-hsr-image>`
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

    if (panelImage) panelImage.style.cssText = app.styles.panelImage;
    if (countRow) countRow.style.cssText = app.styles.panelCount;
    if (buttonRow) buttonRow.style.cssText = app.styles.panelButtonRow;
    panel.querySelectorAll("button").forEach((button) => { button.style.cssText = app.styles.panelButton; });

    panel.addEventListener("click", async (event) => {
      const action = event.target?.dataset?.jalkiwotdaHsrAction;
      if (action === "refresh") {
        app.network.clearResponses();
        window.location.reload();
      } else if (action === "report") {
        await showReport();
      }
    });

    document.body.appendChild(panel);
    updatePanel();
  }

  function installPanelWhenReady() {
    if (document.body) {
      installPanel();
      return;
    }
    window.addEventListener("DOMContentLoaded", installPanel, { once: true });
  }

  Object.assign(app.panel, { updatePanel, installPanelWhenReady, showReport });
})();
