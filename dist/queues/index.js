"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskQueue = void 0;
const tslib_1 = require("tslib");
const bull_1 = tslib_1.__importDefault(require("bull"));
const path_1 = require("path");
const packageInfo = require("../../package.json");
const redisURI = process.env["TASK_QUEUE_HOST"];
const queueCount = process.env["TASK_QUEUE_INSTANCES"] ? parseInt(process.env["TASK_QUEUE_INSTANCES"]) : 2;
const queueName = process.env["TASK_QUEUE_NAME"] ? process.env["TASK_QUEUE_NAME"] : [packageInfo.name, "Task Runner Queue"].join(' - ');
exports.taskQueue = new bull_1.default(queueName, redisURI ? redisURI : (process.env["LOCAL_DEBUG"] ? "redis://127.0.0.1:6379" : "redis://cache"));
function initializeTaskQueue() {
    exports.taskQueue.on("completed", async (_job, completed) => {
        if (completed.tasks.length > 0) {
            const startingJob = completed.tasks[0];
            await exports.taskQueue.add({
                ...completed,
                input: {
                    ...completed.input,
                    component: [completed.tasks[0].path, completed.tasks[0].module ? completed.tasks[0].module : ''].join('/'),
                    initialInput: startingJob.input
                }
            }, {
                delay: startingJob.delay,
                attempts: 5,
                backoff: startingJob.backoff,
                removeOnComplete: true,
                timeout: startingJob.timeout
            });
        }
    });
    exports.taskQueue.process(queueCount, path_1.join(__dirname, "..", "processors", "index.js"));
}
async function cleanup() {
    exports.taskQueue.close();
    process.exit(0);
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
exports.default = initializeTaskQueue;
//# sourceMappingURL=index.js.map