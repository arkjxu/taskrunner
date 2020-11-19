import { Job } from "bull";
import { INextTask } from "../common/types";
declare function runTask(job: Job): Promise<Readonly<INextTask>>;
export default runTask;
