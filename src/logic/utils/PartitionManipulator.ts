import config from "config.json"

import Entity, { ENTITY_TYPES } from "models/Entity";
import Task from "models/Task";
import { PartitionList, EmployeePartitionInterface, TaskPartitionInterface, ProjectPartitionInterface, Partition } from "models/Partition";

import StorageBackendHandler from "logic/storage/backend/StorageBackEnd";
import StorageInMemoryHandler from "logic/storage/in_memory/StorageInMemory";
import EMPTY_INDEX from "logic/utils/EmptyIndex";

/**
 * Manipulator with partitions data.
 */
export default class PartitionManipulator {
    /**
     * Getting partition by entity type.
     * 
     * @param entityType entity type of selected partition.
     * @param partitionList list of partitions.
     */
    getPartitionByType(entityType: string, partitionList: PartitionList) {
        if (entityType === ENTITY_TYPES.employee) {
            return partitionList.employees;
        }
        else if (entityType === ENTITY_TYPES.task) {
            return partitionList.tasks;
        }
        else {
            return partitionList.projects;
        }
    }

    /**
     * Setting the empty executor in task with selected employee.
     * 
     * @param executorId ID of executor to be replaced with a empty executor. 
     * @param taskList list of tasks.
     */
    setEmptyExecutor(executorId: string, taskList: Task[]) {
        taskList.forEach((task, taskIndex) => {
            const isRequiredExecutor = task.employeeId === executorId;
            if (isRequiredExecutor) {
                taskList[taskIndex].employeeId = EMPTY_INDEX;
            }
        })
    }

    /**
     * Setting empty current entities for partitions.
     * 
     * @param partitionList list of partitions.
     */
    setDefaultCurrentEntityInPartitionList(partitionList: PartitionList) {
        partitionList.employees.currentEntity = { ...partitionList.employees.defaultEntity };
        partitionList.tasks.currentEntity = { ...partitionList.tasks.defaultEntity };
        partitionList.projects.currentEntity = { ...partitionList.projects.defaultEntity };
    }

    /**
     * Checking app version - partition list structure.
     * 
     * @param partitionList current partition list.
     * 
     * @return true if app is not latest version. false if app is latest version.
     */
    checkAppVersion(partitionList: PartitionList) {
        let partitionListArray = Object.values(partitionList);

        const isOldVersion = partitionListArray.some((partition) => {
            let checkedEntity = partition.entityList.find((entity: Entity) => {
                return entity.type === undefined || typeof (entity.id) === Number.toString();
            });
            return (checkedEntity !== undefined);
        })
        return isOldVersion;
    }

    /**
     * Updating app version - partition list structure.
     * 
     * @param partitionList not updated partition list.
     * 
     * @return updated partition list.
     */
    updateAppVersion(partitionList: PartitionList) {
        let newPartitionList = Object.values(partitionList);
        newPartitionList.forEach((partition) => {
            partition.entityList.forEach((entity: Entity) => {
                entity.id = entity.id.toString();
                entity.type = partition.entityType;
            })
        })

        let employeePartition = newPartitionList[0];
        this.updateAppVersionEmployeePartition(employeePartition);

        let taskPartition = newPartitionList[1];
        this.updateAppVersionTaskPartition(taskPartition);

        let projectPartition = newPartitionList[2];
        this.updateAppVersionProjectPartition(projectPartition);

        let updatedPartitionList: PartitionList = {
            employees: employeePartition,
            tasks: taskPartition,
            projects: projectPartition,
        }
        return updatedPartitionList;
    }

    /**
     * Update employee partition: update employee properties.
     * 
     * @param employeePartition employee partition. 
     */
    updateAppVersionEmployeePartition(employeePartition: EmployeePartitionInterface) {
        employeePartition.entityList.forEach((employee: any) => {
            employee.position = employee.post;
            delete employee.post;

            employee.type = ENTITY_TYPES.employee;
        })
    }

    /**
     * Update task partition: update task properties.
     * 
     * @param taskPartition task partition. 
     */
    updateAppVersionTaskPartition(taskPartition: TaskPartitionInterface) {
        taskPartition.entityList.forEach((task: any) => {
            task.executionTime = task.work;
            delete task.work;

            task.finishDate = task.endDate;
            delete task.endDate;

            task.employeeId = task.executorID;
            delete task.executorID;

            task.projectId = task.projectID;
            delete task.projectID;

            task.type = ENTITY_TYPES.task;
        })
    }

    /**
     * Update project partition: update project properties.
     * 
     * @param projectPartition project partition. 
     */
    updateAppVersionProjectPartition(projectPartition: ProjectPartitionInterface) {
        projectPartition.entityList.forEach((project: any) => {
            project.shortName = project.name;

            project.type = ENTITY_TYPES.project;
        })
    }

    /**
     * Getting new entity id of current partition.
     *
     * @param currentPartition selected partition.
     * 
     * @return new entity id.
    */
    getNewEntityID(currentPartition: Partition) {
        let newEntityID = EMPTY_INDEX;

        if (config.useInMemory === true) {
            let storageHandler = new StorageInMemoryHandler();
            newEntityID = storageHandler.getNewEntityID(currentPartition);
        }
        else {
            let storageHandler = new StorageBackendHandler();
            newEntityID = storageHandler.getNewEntityID(currentPartition.entityList);
        }
        return newEntityID;
    }
}