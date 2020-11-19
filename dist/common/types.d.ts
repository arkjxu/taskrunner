export interface INextTask {
    tasks: IStepNode[];
    input: Readonly<unknown>;
}
export interface IStep {
    getName: () => Readonly<string>;
    getVersion: () => Readonly<string>;
    setName: (name: string) => void;
    setVersion: (version: string) => void;
    run: (input: Readonly<unknown>) => Promise<Readonly<unknown>>;
}
export interface IStepNode {
    path: string;
    module: string;
    input: Readonly<unknown>;
    backoff: number;
    delay: number;
    timeout: number;
}
export declare abstract class Step implements IStep {
    protected _name: string;
    protected _version: string;
    constructor(_name: string, _version: string);
    getName(): string;
    getVersion(): string;
    setName(name: string): void;
    setVersion(version: string): void;
    abstract run(input: Readonly<unknown>): Promise<Readonly<unknown>>;
}
