import initializeTaskQueue, { taskQueue } from "./queues";
import { IStepNode } from "./common/types";
export { Step } from "./common/types";

export const TQueue = taskQueue;
export const initializeTQueue = initializeTaskQueue;

export interface IStepOptions {
  delay?: number;
  input?: Readonly<unknown>;
  module?: string;
  backoff?: number;
  timeout?: number;
}

export class Runner {
  protected _steps: IStepNode[];
  constructor(protected _name: string, protected _version: string) { this._steps = []; }

  public addStep(componentPath: string, option: IStepOptions = {delay: 0, module: '', input: '', backoff: 3000, timeout: 30000}) {
    const desiredOption = Object.assign({}, {delay: 0, module: '', input: '', backoff: 3000, timeout: 30000}, option);
    const newStep: IStepNode = {
      path: componentPath,
      module: desiredOption.module,
      input: desiredOption.input,
      delay: desiredOption.delay,
      backoff: desiredOption.backoff,
      timeout: desiredOption.timeout
    };
    this._steps.push(newStep);
  }

  public getSteps(): Readonly<IStepNode[]> {
    return this._steps;
  }

  public getStepAtIndex(index: number): IStepNode | null {
    if (index < this._steps.length) return this._steps[index];
    return null;
  }

  public async run(input: Readonly<unknown> = ""): Promise<void> {
    if (this._steps.length > 0) {
      const startingJob: IStepNode = this._steps[0];
      await TQueue.add({
        tasks: this._steps,
        input: {
          ...input,
          initialInput: startingJob.input
        },
      }, {
        delay: startingJob.delay,
        attempts: 5,
        backoff: startingJob.backoff,
        removeOnComplete: true,
        timeout: startingJob.timeout
      });
    }
  }
}

export default Runner;