import initializeTaskQueue from "./queues";
import { IStepNode } from "./common/types";
export { Step } from "./common/types";
export declare const TQueue: import("bull").Queue<any>;
export declare const initializeTQueue: typeof initializeTaskQueue;
export interface IStepOptions {
    delay?: number;
    input?: Readonly<unknown>;
    module?: string;
    backoff?: number;
    timeout?: number;
}
export declare class Runner {
    protected _name: string;
    protected _version: string;
    protected _steps: IStepNode[];
    constructor(_name: string, _version: string);
    addStep(componentPath: string, option?: IStepOptions): void;
    getSteps(): Readonly<IStepNode[]>;
    getStepAtIndex(index: number): IStepNode | null;
    run(input?: Readonly<unknown>): Promise<void>;
}
export default Runner;
