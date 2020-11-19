export interface INextTask {
  tasks: IStepNode[],
  input: Readonly<unknown>
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

export abstract class Step implements IStep {
  constructor(protected _name: string, protected _version: string) {  }
  public getName(): string { return this._name };
  public getVersion(): string { return this._version };
  public setName(name: string): void { this._name = name; }
  public setVersion(version: string): void { this._version = version; }
  public abstract async run(input: Readonly<unknown>): Promise<Readonly<unknown>>
}