const express = require("express");
const {
  useJsesc,
  useSerializeJavascript,
  useSerializeServerState,
} = require("./serializers");

function template(packageName, serializedState) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>${packageName}</title>
  </head>
  <body>
    <main>
      <h1>Redux State Serialization Test</h1>
      <p>This is a page for testing how a package handles secure and fast Redux state serialization. State is server rendered to the page and then reflected back in the following section.</p>
      <p>The test fails if the reflected state is incorrect and if there is any XSS / DOM injection.</p>
      <h2>Reflected State</h2>
      <p>Package name: <b>${packageName}</b></p>
      <div id="state"></div>
    </main>
    <script>window.__PRELOADED_STATE__ = ${serializedState};</script>
    <script>document.querySelector("#state").textContent = JSON.stringify(window.__PRELOADED_STATE__);</script>
  </body>
</html>`;
}

const app = express();

app.use("/jsesc", (_, res) => {
  res.send(template("jsesc", useJsesc()));
});

app.use("/serialize-javascript", (_, res) => {
  res.send(template("serialize-javascript", useSerializeJavascript()));
});

app.use("/serialize-server-state", (_, res) => {
  res.send(template("serialize-server-state", useSerializeServerState()));
});

app.listen(3000, () => {
  console.log(`Server started:
- jsesc: http://localhost:3000/jsesc
- serialize-javascript: http://localhost:3000/serialize-javascript
- serialize-server-state: http://localhost:3000/serialize-server-state`);
});
