import Entity, { ENTITY_TYPES } from "models/Entity";
import Task from "models/Task";
import { Partition, PartitionList } from "models/Partition";

import EmployeeController from "logic/storage/backend/EmployeeController";
import ProjectController from "logic/storage/backend/ProjectController";
import TaskController from "logic/storage/backend/TaskController";

/**
 * A common type for all controller models.
 */
type CONTROLLER = ProjectController | TaskController | EmployeeController;

/**
 * Default type entity controller. It's default because default current partition is ProjectPartition.
 */
const DEFAULT_CONTROLLER: CONTROLLER = new ProjectController();

/**
 * Handler of backend data storage.
 */
export default class StorageBackendHandler {
    /**
     * Getting controller of current partition.
     * 
     * @param entityType type of current partition.
     * 
     * @returns selected controller of current partition.
     */
    getCurrentController(entityType: string) {
        let currentPartitionController = DEFAULT_CONTROLLER;

        if (entityType === ENTITY_TYPES.project) {
            currentPartitionController = new ProjectController();
        }
        else if (entityType === ENTITY_TYPES.employee) {
            currentPartitionController = new EmployeeController();
        }
        else if (entityType === ENTITY_TYPES.task) {
            currentPartitionController = new TaskController();
        }

        return currentPartitionController;
    }

    /**
     * Updating selected partition in app, loading updates from storage.
     * 
     * @param partition selected partition for updating.
     */
    async updatePartition(partition: Partition) {
        const entityType = partition.currentEntity.type;
        let partitionController = this.getCurrentController(entityType);

        await partitionController.getAll().then(entityList =>
            partition.entityList = entityList
        );
    }

    /**
     * Updating partition list in app, loading updates from storage.
     * 
     * @param partitionList list of partitions for updating.
     */
    async updatePartitionList(partitionList: PartitionList) {
        let projectController = new ProjectController();
        await projectController.getAll().then((projectList) =>
            partitionList.projects.entityList = projectList
        );

        let employeeController = new EmployeeController();
        await employeeController.getAll().then((employeeList) =>
            partitionList.employees.entityList = employeeList
        );

        let taskController = new TaskController();
        await taskController.getAll().then((taskList) =>
            partitionList.tasks.entityList = taskList
        );
    }

    /**
     * Remove employee from backend storage.
     *
     * @param employeeId  id of the employee being deleted.
    */
    async removeEmployee(employeeId: string) {
        let employeeController = new EmployeeController();
        await employeeController.delete(employeeId);
    }

    /**
     * Remove task from backend storage.
     *
     * @param taskId id of the task being deleted.
    */
    async removeTask(taskId: string) {
        let taskController = new TaskController();
        await taskController.delete(taskId)
    }

    /**
     * Remove project from backend storage and related task entities.
     *
     * @param projectId id of the project being deleted.
     * @param partitionList list of partitions.
    */
    async removeProject(projectId: string, partitionList: PartitionList) {
        let projectControllere = new ProjectController();
        await this.removeProjectTaskList(projectId, partitionList.tasks.entityList).then(() => {
            projectControllere.delete(projectId)
        })
    }

    /**
     * Remove task entities related with selected project.
     *
     * @param projectId id of the project id that task list being deleted.
     * @param taskList main task list.
    */
    async removeProjectTaskList(projectId: string, taskList: Task[]) {
        let idList: string[] = [];
        taskList.forEach(task => {
            if (task.projectId === projectId) {
                idList.push(task.id);
            }
        });
        let taskController = new TaskController();
        idList.forEach(async (removingTaskId) => {
            await taskController.delete(removingTaskId)
        })
    }

    /**
     * Getting new entity id of current entity list.
     *
     * @param entityList selected entity list.
     * 
     * @return new entity id.
    */
    getNewEntityID(entityList: Entity[]) {
        const lastEntity = entityList[entityList.length - 1];
        const newId = (lastEntity === undefined) ? "1" : (Number(lastEntity.id) + 1).toString();
        return newId;
    }
}