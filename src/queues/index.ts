import Queue from "bull";
import { IStepNode } from '../common/types';
import { join as pathJoin } from "path";
import { INextTask } from "../common/types";

const packageInfo = require("../../package.json");

const redisURI = process.env["TASK_QUEUE_HOST"];
const queueCount = process.env["TASK_QUEUE_INSTANCES"] ? parseInt(process.env["TASK_QUEUE_INSTANCES"]) : 2;
const queueName = process.env["TASK_QUEUE_NAME"] ? process.env["TASK_QUEUE_NAME"] : [packageInfo.name, "Task Runner Queue"].join(' - ');

export const taskQueue = new Queue(
  queueName,
  redisURI ? redisURI : (process.env["LOCAL_DEBUG"] ? "redis://127.0.0.1:6379" : "redis://cache")
);

function initializeTaskQueue() {
  taskQueue.on(
    "completed",
    async (_job: Queue.Job, completed: Readonly<INextTask>) => {
      if (completed.tasks.length > 0) {
        const startingJob: IStepNode = completed.tasks[0];
        await taskQueue.add({
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
    }
  );
  
  taskQueue.process(
    queueCount,
    pathJoin(__dirname, "..", "processors", "index.js")
  );
}

async function cleanup() {
  taskQueue.close();
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

export default initializeTaskQueue;