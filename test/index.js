const { Runner, initializeTQueue, TQueue } = require("../dist/main");
const { join } = require("path");

(async () => {

  TQueue.on("error", (j, e) => {
    console.log(e);
  });


  TQueue.on("failed", (j, e) => {
    console.log(e);
  });

  initializeTQueue();

  const myRunner = new Runner("test", "1.0.0");
  myRunner.addStep(join(__dirname, "testStep"));
  myRunner.addStep(join(__dirname, "testStep2"));
  myRunner.addStep(join(__dirname, "testStep3"));
  myRunner.run("Test");
})();