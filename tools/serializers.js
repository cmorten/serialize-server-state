const jsesc = require("jsesc");
const serializeJavascript = require("serialize-javascript");
const state = require("./state");
const serialize = require("../src");

function replacerFactory(map) {
  return function replacer(str) {
    return map[str];
  };
}

function useJsesc() {
  return (
    "JSON.parse(" +
    jsesc(JSON.stringify(state), {
      json: true,
      isScriptContext: true,
      quotes: "single",
      wrap: true,
      minimal: true,
    }) +
    ")"
  );
}

const serializeJavascriptReplacer = replacerFactory({
  "'": "\\'",
  "\\u0000": "\\\\u0000",
  "\\": "\\\\",
});

const serializeJavascriptRegexMatcher = /'|\\u0000|\\(?!u)/g;

function useSerializeJavascript() {
  return (
    "JSON.parse('" +
    serializeJavascript(state, { isJSON: true }).replace(
      serializeJavascriptRegexMatcher,
      serializeJavascriptReplacer
    ) +
    "')"
  );
}

function useSerializeServerState() {
  return serialize(state);
}

module.exports = {
  useJsesc,
  useSerializeJavascript,
  useSerializeServerState,
};
