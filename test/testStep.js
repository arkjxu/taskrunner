const { Step } = require("../dist/main");

class Test extends Step {
  constructor(name = "Test", version = "1.0.0") {
    super(name, version);
  }
  async run(input) {
    console.log("In Test: " + input);
    return this._name;
  }
}

module.exports = Test;
