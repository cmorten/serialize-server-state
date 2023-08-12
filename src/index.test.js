const serialize = require("./");

describe("serialize-server-state", () => {
  describe("JSON serializable values", () => {
    test.each`
      description                                      | state                                                         | expected
      ${"null"}                                        | ${null}                                                       | ${"null"}
      ${"number"}                                      | ${1}                                                          | ${"1"}
      ${"boolean"}                                     | ${true}                                                       | ${"true"}
      ${"empty object"}                                | ${{}}                                                         | ${"{}"}
      ${"empty array"}                                 | ${[]}                                                         | ${"[]"}
      ${"empty string"}                                | ${""}                                                         | ${'""'}
      ${"non-empty string"}                            | ${"test-string"}                                              | ${'"test-string"'}
      ${"Special Characters: \\0"}                     | ${"\0"}                                                       | ${'"\\\\u0000"'}
      ${"Special Characters: \\b"}                     | ${"\b"}                                                       | ${'"\\\\b"'}
      ${"Special Characters: \\t"}                     | ${"\t"}                                                       | ${'"\\\\t"'}
      ${"Special Characters: \\n"}                     | ${"\n"}                                                       | ${'"\\\\n"'}
      ${"Special Characters: \\f"}                     | ${"\f"}                                                       | ${'"\\\\f"'}
      ${"Special Characters: \\r"}                     | ${"\r"}                                                       | ${'"\\\\r"'}
      ${"Special Characters: \\\\"}                    | ${"\\"}                                                       | ${'"\\\\\\\\"'}
      ${"Special Characters: \\u2028"}                 | ${"\u2028"}                                                   | ${'"\\u2028"'}
      ${"Special Characters: \\u2029"}                 | ${"\u2029"}                                                   | ${'"\\u2029"'}
      ${"XSS: </script><script>alert()</script>"}      | ${"</script><script>alert()</script>"}                        | ${'"\\u003C/script>\\u003Cscript>alert()\\u003C/script>"'}
      ${"XSS: </style><style>body{color:red}</style>"} | ${"</style><style>body{color:red}</style>"}                   | ${'"\\u003C/style>\\u003Cstyle>body{color:red}\\u003C/style>"'}
      ${"XSS: <!-- HTML comment -->"}                  | ${"<!-- HTML comment -->"}                                    | ${'"\\u003C!-- HTML comment -->"'}
      ${"non-empty object"}                            | ${{ key: "\0\b\t\n\f\r\\\u2028\u2029</script></style><!--" }} | ${'{"key":"\\\\u0000\\\\b\\\\t\\\\n\\\\f\\\\r\\\\\\\\\\u2028\\u2029\\u003C/script>\\u003C/style>\\u003C!--"}'}
    `("$description", ({ state, expected }) => {
      const result = serialize(state);

      expect(result).toEqual("JSON.parse('" + expected + "')");
      expect(eval(result)).toEqual(state);
    });
  });

  describe("simple non-JSON serializable values", () => {
    test.each`
      description                   | state                    | expected
      ${"undefined"}                | ${undefined}             | ${"null"}
      ${"symbol"}                   | ${Symbol("test-symbol")} | ${"null"}
      ${"infinity"}                 | ${Infinity}              | ${"null"}
      ${"function"}                 | ${function () {}}        | ${"null"}
      ${"arrow function"}           | ${() => {}}              | ${"null"}
      ${"class"}                    | ${class ClassName {}}    | ${"null"}
      ${"object method"}            | ${{ method() {} }}       | ${"{}"}
      ${"object property function"} | ${{ method: () => {} }}  | ${"{}"}
      ${"object getter"} | ${{
  get a() {
    return 1;
  },
}} | ${'{"a":1}'}
      ${"object setter"} | ${{
  set a(value) {
    this.a = value;
  },
}} | ${"{}"}
    `("$description", ({ state, expected }) => {
      expect(serialize(state)).toEqual("JSON.parse('" + expected + "')");
    });
  });

  test("does not handle bigint primitive type", () => {
    expect(() => serialize(BigInt(Number.MAX_SAFE_INTEGER))).toThrow();
  });

  test("does not handle circular objects", () => {
    const state = {};
    state.circle = state;

    expect(() => serialize(state)).toThrow();
  });
});
