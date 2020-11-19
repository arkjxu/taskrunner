# Task Runner
A simple Step runner similar to Jiffy.

## Configuration
- [TASK_QUEUE_NAME]() - Name of Task Queue
- [TASK_QUEUE_INSTANCES]() - Number of instances for Queue
- [TASK_QUEUE_HOST]() - IP/Host of Redis.  ex. redis://127.0.0.1:6379

## Step
To Create a step, simply create a Javascript or Typescript file which exports default or exports multiple components with
the following syntax:

```typescript
import { Step } from "taskrunner";

/*
*  Typescript export default
*/
class CreatOrder extends Step {
  constructor(name: string = "Create Order", version: string = "1.0.0") {
    super(name, version);
  }
  public async run(input: Readonly<unknown>): Promise<Readonly<string>>  {
    console.log("In Create: " + input);
    return this._name;
  }
}

export default CreatOrder;

/*
*  Typescript exporting multiple components
*/
export class CreatOrder extends Step {
  constructor(name: string = "Create Order", version: string = "1.0.0") {
    super(name, version);
  }
  public async run(input: Readonly<unknown>): Promise<Readonly<string>>  {
    console.log("In Create: " + input);
    return this._name;
  }
}

export class SubmitPayment extends Step {
  constructor(name: string = "Submit Payment Order", version: string = "1.0.0") {
    super(name, version);
  }
  public async run(input: Readonly<unknown>): Promise<Readonly<string>>  {
    console.log("In Create: " + input);
    return this._name;
  }
}

/*
*  Javascript export
*/
class CreatOrder extends Step {
  constructor(name = "Create Order", version = "1.0.0") {
    super(name, version);
  }
  public async run(input){
    console.log("In Create: " + input);
    return this._name;
  }
}

module.exports = CreateOrder;
// OR
exports.default = CreateOrder;
```

## Creating and running a Task
```typescript
import Runner from "taskrunner";
import { join as pathResolve} from "path";

(async () => {
  const createLegacyOrder = new Runner("CN SLSU", "1.0.0");
  createLegacyOrder.addStep(pathResolve(__dirname, "components", "myComponent.js"));
  createLegacyOrder.addStep(pathResolve(__dirname, "components", "multipleComponents.js"), {
    module: "SubmitPayment",
    delay: 1000 // Delay step by 1 second
  });

  await createLegacyOrder.run("Initial Input");
})();
```