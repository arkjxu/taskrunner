const { Runner } = require("../dist/main");
const { join } = require("path");

(async () => {
  const myRunner = new Runner("test", "1.0.0");
  myRunner.addStep(join(__dirname, "com.js"));
  myRunner.run("Test");
})();