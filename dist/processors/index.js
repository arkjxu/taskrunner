"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function runTask(job) {
    return new Promise(async (resolve, reject) => {
        const taskList = job.data;
        let componentModule = null;
        if (!require.cache[taskList.tasks[0].path]) {
            componentModule = require(taskList.tasks[0].path.includes('.js') ? taskList.tasks[0].path : taskList.tasks[0].path + '.js');
        }
        try {
            if (!componentModule)
                throw new Error(`Unable to get component: ${taskList.tasks[0].path}`);
            let componentClass = taskList.tasks[0].module ? componentModule[taskList.tasks[0].module] : componentModule.default ? componentModule.default : componentModule;
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