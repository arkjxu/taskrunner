import { Job } from "bull";
import { INextTask, Step } from "../common/types";
import { relative } from "path";

function runTask(job: Job): Promise<Readonly<INextTask>> {
  return new Promise(async (resolve: (v: Readonly<INextTask>) => void, reject: (e: Error) => void) => {
    const taskList: INextTask = job.data;
    let componentModule: any = null;
    const relativePath = relative(__dirname, taskList.tasks[0].path);
    if (!require.cache[relativePath]) {
      componentModule = require(relativePath);
    }
    try {
      if (!componentModule) throw new Error(`Unable to get component: ${taskList.tasks[0].path}`);
      let componentClass: any = taskList.tasks[0].module ? componentModule[taskList.tasks[0].module] : componentModule.default ? componentModule.default: componentModule;
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