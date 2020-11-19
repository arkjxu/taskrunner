import { Job } from "bull";
import { INextTask, Step } from "../common/types";

function runTask(job: Job): Promise<Readonly<INextTask>> {
  return new Promise(async (resolve: (v: Readonly<INextTask>) => void, reject: (e: Error) => void) => {
    const taskList: INextTask = job.data;
    const componentModule: any = require(taskList.tasks[0].path);
    try {
      let componentClass: any = taskList.tasks[0].module ? componentModule[taskList.tasks[0].module] : componentModule.getName ? componentModule : componentModule.default;
      let output: Readonly<unknown> = "";
      const component: Step = new componentClass();
      output = await component.run({
        ...taskList.input,
        component: component.getName()
      });
      const nextTasks: INextTask = {
        tasks: taskList.tasks.slice(1),
        input: {
          ...output,
          component: component.getName()
        }
      };
      resolve({
        ...nextTasks
      });
    }
    catch(e) {
      reject(e)
    }
  });
}
export default runTask;