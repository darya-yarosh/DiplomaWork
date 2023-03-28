
import { ENTITY_TYPES } from "models/Entity";
import { Partition, PartitionList, EmployeePartitionInterface, TaskPartitionInterface, ProjectPartitionInterface } from "models/Partition";

import PartitionManipulator from "logic/utils/PartitionManipulator";
import EMPTY_INDEX from 'logic/utils/EmptyIndex';

/**
 * String values of sections of storage.
 * 
 * @param partitions  section of partitions.
 * @param currentPartition  section of current partition.
 * @param ids  section of entity ids of partitions.
 */
export const enum STORAGE_SECTIONS {
    partitionList = "Partitions",
    currentPartition = "CurrentPartition",
    IDs = "IDs",
}

/**
 * List of entities ids.
 * 
 * @param employees  ids of employee entities.
 * @param tasks  ids of task entities.
 * @param projects  ids of projects entities.
 */
export interface IDs {
    employees: string[];
    tasks: string[];
    projects: string[];
}

/**
 * List of IDs.
 * 
 * @param employees  list of employees ids.
 * @param tasks  list of tasks ids.
 * @param projects  list of project ids.
 */
export const DEFAULT_IDS: IDs = {
    employees: [],
    tasks: [],
    projects: []
}

/**
 * Handler of in-memory data storage.
 */
export default class StorageInMemoryHandler {
    /**
     * Creating data for storage.
     * 
     * @param currentPartition current partition.
     * @param partitionList list of partitions.
     */
    createData(currentPartition: Partition, partitionList: PartitionList) {
        this.setPartitionList(partitionList);
        this.setCurrentPartition(currentPartition);

        this.setIDs(DEFAULT_IDS);
    }

    /**
     * Loading data from storage.
     */
    loadData() {
        let loadedPartitionList = this.getPartitionList() as PartitionList;
        let loadedCurrentPartition = this.getCurrentPartition() as Partition;

        const partitionManipulator = new PartitionManipulator();
        let isOldAppVersion = partitionManipulator.checkAppVersion(loadedPartitionList);
        if (isOldAppVersion) {
            loadedPartitionList = partitionManipulator.updateAppVersion(loadedPartitionList);
            loadedCurrentPartition = loadedPartitionList.projects;

            this.setPartitionList(loadedPartitionList);
            this.setCurrentPartition(loadedCurrentPartition);
        }

        isOldAppVersion = false;
    }

    /**
     * Checking is storage is empty.
     * 
     * @return true if storage empty. false if storage is not empty.
     */
    isStorageEmpty() {
        let isStorageEmpty = window.localStorage.getItem(STORAGE_SECTIONS.partitionList) === null;
        return isStorageEmpty;
    }

    /**
     * Saving loaded partitions to storage.
     * 
     * @param partitionList  loaded partitions.
     */
    setPartitionList(partitionList: PartitionList) {
        let partitionsForStorage = JSON.stringify(partitionList);
        window.localStorage.setItem(STORAGE_SECTIONS.partitionList, partitionsForStorage);
    }

    /**
     * Getting partitions data from storage.
     * 
     * @return partitions data.
     */
    getPartitionList() {
        let partitionList = window.localStorage.getItem(STORAGE_SECTIONS.partitionList);
        return { ...JSON.parse(partitionList as string) };
    }

    /**
     * Saving loaded current partition to storage.
     * 
     * @param currentPartition  loaded current partition.
     */
    setCurrentPartition(currentPartition: Partition) {
        let currentPartitionForStorage = JSON.stringify(currentPartition);
        window.localStorage.setItem(STORAGE_SECTIONS.currentPartition, currentPartitionForStorage);
    }

    /**
     * Getting current partition data from storage.
     * 
     * @return current partition data.
     */
    getCurrentPartition() {
        let currentPartitionFromStorage = window.localStorage.getItem(STORAGE_SECTIONS.currentPartition);
        return { ...JSON.parse(currentPartitionFromStorage as string) as Partition };
    }

    /**
     * Getting current entity from storage.
     * 
     * @return current entity.
     */
    getCurrentEntity() {
        return this.getCurrentPartition().currentEntity;
    }

    /**
     * Getting employees partition data from storage.
     * 
     * @return employees partition data.
     */
    getEmployeePartition() {
        return this.getPartitionList().employees as EmployeePartitionInterface;
    }

    /**
     * Getting tasks partition data from storage.
     * 
     * @return tasks partition data.
     */
    getTaskPartition() {
        return this.getPartitionList().tasks as TaskPartitionInterface;
    }

    /**
     * Getting projects partition data from storage.
     * 
     * @return projects partition data.
     */
    getProjectPartition() {
        return this.getPartitionList().projects as ProjectPartitionInterface;
    }

    /**
     * Getting entities of current partition from storage.
     * 
     * @return entities of current partition.
     */
    getCurrentEntityList() {
        return this.getCurrentPartition().entityList;
    }

    /**
     * Catching the unloading of page.
     * 
     * @param isNeedToCatch  value of using the catcher when unloading from the window.
     */
    catchUnloading(isNeedToCatch: boolean) {
        if (isNeedToCatch) {
            window.onbeforeunload = (event: BeforeUnloadEvent) => {
                event.preventDefault();
                if (event) {
                    const partitionManipulator = new PartitionManipulator();
                    partitionManipulator.setDefaultCurrentEntityInPartitionList(this.getPartitionList());

                    this.setPartitionList(this.getPartitionList());
                    this.setCurrentPartition(this.getCurrentPartition());
                }
            }
        }
        else {
            window.onbeforeunload = null;
        }
    }

    /**
     * Saving loaded IDs of entities to storage.
     * 
     * @param IDs  loaded IDs of entities.
     */
    setIDs(IDs: IDs) {
        let IDsForStorage = JSON.stringify(IDs);
        window.localStorage.setItem(STORAGE_SECTIONS.IDs, IDsForStorage);
    }

    /**
     * Saving loaded IDs of employee entities to storage.
     */
    setEmployeeID() {
        let employeeListIDS = this.getEmployeeIDs();
        employeeListIDS.push(employeeListIDS.length.toString());

        let IDs = {
            employees: employeeListIDS,
            tasks: this.getTaskIDs(),
            projects: this.getProjectIDs()
        }

        this.setIDs(IDs);
    }

    /**
     * Saving loaded IDs of task entities to storage.
     */
    setTaskID() {
        let taskIDS = this.getTaskIDs();
        taskIDS.push(taskIDS.length.toString());

        let IDs = {
            employees: this.getEmployeeIDs(),
            tasks: taskIDS,
            projects: this.getProjectIDs()
        }

        this.setIDs(IDs);
    }

    /**
     * Saving loaded IDs of project entities to storage.
     */
    setProjectID() {
        let projectIDs = this.getProjectIDs();
        projectIDs.push(projectIDs.length.toString());

        let IDs = {
            employees: this.getEmployeeIDs(),
            tasks: this.getTaskIDs(),
            projects: projectIDs
        }

        this.setIDs(IDs);
    }

    /**
     * Getting IDs of entities from storage.
     * 
     * @return IDs of entities.
     */
    getIDs() {
        let IDs = window.localStorage.getItem(STORAGE_SECTIONS.IDs);
        return { ...JSON.parse(IDs as string) };
    }

    /** 
     * Getting IDs of employee entities from storage.
     * 
     * @return IDs of employee entities.
    */
    getEmployeeIDs() {
        let employeeIDS = (this.getIDs() as IDs).employees;
        return employeeIDS;
    }

    /** 
     * Getting IDs of task entities from storage.
     * 
     * @return IDs of task entities.
    */
    getTaskIDs() {
        let taskIDS = (this.getIDs() as IDs).tasks;
        return taskIDS;
    }

    /** 
     * Getting IDs of project entities from storage.
     * 
     * @return IDs of project entities.
    */
    getProjectIDs() {
        let projectIDS = (this.getIDs() as IDs).projects;
        return projectIDS;
    }

    /**
     * Getting new entity id of current partition.
     *
     * @param currentPartition selected partition.
     * 
     * @return new entity id.
    */
    getNewEntityID(currentPartition: Partition) {
        let newID = EMPTY_INDEX;
        if (currentPartition.currentEntity.type === ENTITY_TYPES.employee) {
            newID = this.getEmployeeIDs().length.toString();
        }
        else if (currentPartition.currentEntity.type === ENTITY_TYPES.task) {
            newID = this.getTaskIDs().length.toString();
        }
        else if (currentPartition.currentEntity.type === ENTITY_TYPES.project) {
            newID = this.getProjectIDs().length.toString();
        }
        else {
            // This case will not be worked out, because EntityType is always specified.
        }
        return newID;
    }

    /**
     * Remove employee from employee list and from related entities.
     *
     * @param employeeId  id of the employee being deleted.
     * @param partitionList list of partitions.
    */
    removeEmployee(employeeId: string, partitionList: PartitionList) {
        const partitionManipulator = new PartitionManipulator();
        partitionManipulator.setEmptyExecutor(employeeId, partitionList.tasks.entityList);

        let employeePartition = partitionList.employees;
        employeePartition.entityList = employeePartition.entityList.filter(entity => entity.id !== employeeId);
    }

    /**
     * Remove task from task list.
     *
     * @param taskId  id of the task being deleted.
     * @param partitionList partition list.
    */
    removeTask(taskId: string, partitionList: PartitionList) {
        let taskPartition = partitionList.tasks;
        taskPartition.entityList = taskPartition.entityList.filter(entity => taskId !== entity.id);
    }

    /**
     * Remove project from project list and related task entities.
     *
     * @param projectId  id of the project being deleted.
     * @param partitionList partition list.
    */
    removeProject(projectId: string, partitionList: PartitionList) {
        let taskList = partitionList.tasks;
        taskList.entityList = taskList.entityList.filter(task => task.projectId !== projectId);

        let projectPartition = partitionList.projects;
        projectPartition.entityList = projectPartition.entityList.filter(project => project.id! !== projectId);
    }
}