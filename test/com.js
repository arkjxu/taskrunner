const { Step } = require("../dist/main");

class CreatOrder extends Step {
  constructor(name = "Create Order", version = "1.0.0") {
    super(name, version);
  }
  async run(input) {
    console.log("In Create: " + input);
    return this._name;
  }
}

module.exports = CreatOrder;
