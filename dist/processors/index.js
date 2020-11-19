"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function runTask(job) {
    return new Promise(async (resolve, reject) => {
        const taskList = job.data;
        const componentModule = require(taskList.tasks[0].path);
        try {
            let componentClass = taskList.tasks[0].module ? componentModule[taskList.tasks[0].module] : componentModule.getName ? componentModule : componentModule.default;
            let output = "";
            const component = new componentClass();
            output = await component.run({
                ...taskList.input,
                component: component.getName()
            });
            const nextTasks = {
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
        catch (e) {
            reject(e);
        }
    });
}
exports.default = runTask;
//# sourceMappingURL=index.js.map