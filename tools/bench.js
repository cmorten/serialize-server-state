const Benchmark = require("benchmark");
const {
  useJsesc,
  useSerializeJavascript,
  useSerializeServerState,
} = require("./serializers");

const suite = new Benchmark.Suite();

suite
  .add("jsesc", () => {
    // https://www.npmjs.com/package/jsesc
    useJsesc();
  })
  .add("serialize-javascript", () => {
    // https://www.npmjs.com/package/serialize-javascript
    useSerializeJavascript();
  })
  .add("serialize-server-state", () => {
    useSerializeServerState();
  })
  .on("cycle", (event) => {
    const benchmark = event.target;

    console.log(benchmark.toString());
  })
  .on("complete", (event) => {
    const suite = event.currentTarget;
    const fastestOption = suite.filter("fastest").map("name");

    console.log(`The fastest option is ${fastestOption}`);
  })
  .run();
