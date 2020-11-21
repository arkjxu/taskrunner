import { Job } from "bull";
import { INextTask, Step } from "../common/types";

function runTask(job: Job): Promise<Readonly<INextTask>> {
  return new Promise(async (resolve: (v: Readonly<INextTask>) => void, reject: (e: Error) => void) => {
    const taskList: INextTask = job.data;
    let componentModule: any = null;
    if (!require.cache[taskList.tasks[0].path]) {
      componentModule = require(taskList.tasks[0].path.includes('.js') ? taskList.tasks[0].path : taskList.tasks[0].path + '.js');
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