const CHARACTER_REPLACEMENT_MAP = {
  "'": "\\'",
  "<": "\\u003C",
  "\\": "\\\\",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

const CHARACTER_REPLACEMENT_MATCH_REGEX = /['<\\\u2028\u2029]/g;
const PREFIX = "JSON.parse('";
const SUFFIX = "')";
const NULL = PREFIX + "null" + SUFFIX;

function replacer(character) {
  return CHARACTER_REPLACEMENT_MAP[character];
}

function serialize(state) {
  // Fast path for handling undefined and null
  if (state == undefined) {
    return NULL;
  }

  const stringified = JSON.stringify(state);

  if (!stringified) {
    return NULL;
  }

  return (
    PREFIX +
    stringified.replace(CHARACTER_REPLACEMENT_MATCH_REGEX, replacer) +
    SUFFIX
  );
}

module.exports = serialize;
