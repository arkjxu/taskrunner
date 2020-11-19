"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = exports.initializeTQueue = exports.TQueue = exports.Step = void 0;
const tslib_1 = require("tslib");
const queues_1 = tslib_1.__importStar(require("./queues"));
var types_1 = require("./common/types");
Object.defineProperty(exports, "Step", { enumerable: true, get: function () { return types_1.Step; } });
exports.TQueue = queues_1.taskQueue;
exports.initializeTQueue = queues_1.default;
class Runner {
    constructor(_name, _version) {
        this._name = _name;
        this._version = _version;
        this._steps = [];
    }
    addStep(componentPath, option = { delay: 0, module: '', input: '', backoff: 3000, timeout: 30000 }) {
        const desiredOption = Object.assign({}, { delay: 0, module: '', input: '', backoff: 3000, timeout: 30000 }, option);
        const newStep = {
            path: componentPath,
            module: desiredOption.module,
            input: desiredOption.input,
            delay: desiredOption.delay,
            backoff: desiredOption.backoff,
            timeout: desiredOption.timeout
        };
        this._steps.push(newStep);
    }
    getSteps() {
        return this._steps;
    }
    getStepAtIndex(index) {
        if (index < this._steps.length)
            return this._steps[index];
        return null;
    }
    async run(input = "") {
        if (this._steps.length > 0) {
            const startingJob = this._steps[0];
            await exports.TQueue.add({
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
exports.Runner = Runner;
exports.default = Runner;
//# sourceMappingURL=main.js.map