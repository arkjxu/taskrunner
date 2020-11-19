import Queue from "bull";
export declare const taskQueue: Queue.Queue<any>;
declare function initializeTaskQueue(): void;
export default initializeTaskQueue;
