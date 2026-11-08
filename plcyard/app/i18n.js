// The page's language: ?lang= in the link, the one picked in the settings menu, or else the browser's. A dictionary per
// language (i18n/<lang>.json) maps the English text to the translation; missing text stays English.
"use strict";

const I18N = (() => {
  const LANGS = { en: "English", es: "Español", pt: "Português", fr: "Français", it: "Italiano", zh: "中文", ar: "العربية" };
  let dict = {}, lang = "en";

  function pick() {
    const asked = new URLSearchParams(location.search).get("lang");     // a link can pick it: ?lang=es
    if (asked && asked in LANGS) return asked;
    let saved = null;
    try { saved = localStorage.getItem("plcyard.lang"); } catch { /* private window */ }
    if (saved && saved in LANGS) return saved;
    for (const l of navigator.languages || [navigator.language || "en"]) {
      const k = String(l).toLowerCase().split("-")[0];
      if (k in LANGS) return k;
    }
    return "en";
  }

  function t(s, vars) {
    let out = dict[s] || s;
    if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return out;
  }

  // The static page: every text node, title, aria-label and placeholder found in the dictionary.
  function translate(root) {
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n; (n = walk.nextNode());) {
      const k = n.nodeValue.trim();
      if (k && dict[k]) n.nodeValue = n.nodeValue.replace(k, dict[k]);
    }
    for (const a of ["title", "aria-label", "placeholder"]) {
      for (const el of root.querySelectorAll(`[${a}]`)) {
        const v = dict[el.getAttribute(a)];
        if (v) el.setAttribute(a, v);
      }
    }
  }

  async function load(version) {
    lang = pick();
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (lang !== "en") {
      try { dict = await (await fetch(`i18n/${lang}.json?v=${version}`)).json(); } catch { dict = {}; }
    }
    translate(document);
    return lang;
  }

  function set(l) {
    try { localStorage.setItem("plcyard.lang", l); } catch { /* private window: this visit only */ }
    const url = new URL(location.href);
    url.searchParams.set("lang", l);
    location.replace(url);               // the program is autosaved, so it comes back
  }

  return { LANGS, load, t, set, get lang() { return lang; } };
})();
const t = I18N.t;
