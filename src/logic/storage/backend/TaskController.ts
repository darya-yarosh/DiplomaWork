import RequestHandler from "logic/storage/backend/RequestHandler";

import { ENTITY_TYPES } from "models/Entity";
import Task from "models/Task";

import EMPTY_INDEX from "logic/utils/EmptyIndex";

/**
 * Controller of task section from backend.
 */
export default class TaskController {
    taskLink: string;

    constructor() {
        this.taskLink = `http://localhost:8080/api/tasks/`;
    }

    /**
     * Send request to create new task.
     * 
     * @param newTask data of new task.
     * 
     * @returns result of request. true if task is created. false if task is not created.
     */
    async create(newTask: any) {
        let requestHandler = new RequestHandler();

        delete newTask.type;
        newTask.executionTime = newTask.executionTime === "" ? null : Number(newTask.executionTime);
        newTask.employeeId = newTask.employeeId === EMPTY_INDEX ? null : newTask.employeeId;
        //@ts-ignore
        let engStatus = statusListENG[newTask.status];
        newTask.status = engStatus;

        let src = this.taskLink;
        const task = await requestHandler.createData(src, newTask);
        return task;
    }

    /**
     * Send request to update task.
     * 
     * @param id id of updating task.
     * @param updatedTask new data of task.
     * 
     * @returns result of request. true if task is updated. false if task is not updated.
     */
    async update(id: string, updatedTask: any) {
        let requestHandler = new RequestHandler();

        //@ts-ignore
        let engStatus = statusListENG[updatedTask.status];
        updatedTask.status = engStatus;
        updatedTask.executionTime = updatedTask.executionTime === "" ? null : Number(updatedTask.executionTime);
        updatedTask.employeeId = updatedTask.employeeId === EMPTY_INDEX ? null : updatedTask.employeeId;

        let src = this.taskLink + `${id}`;
        const task = await requestHandler.updateData(src, updatedTask);
        return task;
    }

    /**
     * Send request to remove task.
     * 
     * @param id id of removing task.
     * 
     * @returns result of request. true if task is removed. false if task is not removed.
     */
    async delete(id: string) {
        let requestHandler = new RequestHandler();

        let src = this.taskLink + `${id}`;
        const task = await requestHandler.deleteData(src);
        return task;
    }

    /**
     * Send request to get task list.
     * 
     * @returns task entity list.
     */
    async getAll() {
        let requestHandler = new RequestHandler();

        let srcMain = this.taskLink;
        const taskListDefault = await requestHandler.getData(srcMain);

        let size = taskListDefault.totalElements;;
        let srcContent = this.taskLink + `?size=${size}`;
        const taskLinkFull = await requestHandler.getData(srcContent);

        taskLinkFull.content.forEach((task: Task) => {
            task.type = ENTITY_TYPES.task
            task.executionTime = task.executionTime === null ? "" : task.executionTime.toString();
            task.employeeId = task.employeeId === null ? EMPTY_INDEX : task.employeeId;
            //@ts-ignore
            let ruStatus = statusListRU[task.status];
            task.status = ruStatus;
        })
        return taskLinkFull.content;
    }

    /**
     * Send request to get task data.
     * 
     * @param id id of getting task.
     * 
     * @returns task data.
     */
    async get(id: string) {
        let requestHandler = new RequestHandler();

        let src = this.taskLink + `${id}`;
        const task = await requestHandler.getData(src);

        task.type = ENTITY_TYPES.task;
        task.executionTime = task.executionTime === null ? "" : task.executionTime.toString();
        task.employeeId = task.employeeId === null ? EMPTY_INDEX : task.employeeId;
        //@ts-ignore
        let ruStatus = statusListRU[task.status];
        task.status = ruStatus;
        return task;
    }
}