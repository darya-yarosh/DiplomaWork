import { Component } from "react";
import config from "config.json";

import { ManagementTools, sectionForShow } from "App";
import { PartitionListContext } from "logic/Context";

import Entity, { ENTITY_TYPES } from "models/Entity";
import Employee from "models/Employee";
import Project from "models/Project";
import Task from "models/Task";
import { PartitionList } from "models/Partition";

import EmployeeController from "logic/storage/backend/EmployeeController";
import ProjectController from "logic/storage/backend/ProjectController";
import TaskController from "logic/storage/backend/TaskController";

import StorageInMemoryHandler from "logic/storage/in_memory/StorageInMemory";
import PartitionManipulator from "logic/utils/PartitionManipulator";

import FormEmployee from "components/forms/FormEmployee";
import FormTask from "components/forms/FormTask";
import FormProject from "components/forms/FormProject";

import "components/forms/Form.css";

/**
 * List of navigation buttons values.
 * 
 * @param createEntity  text of creation entity button.
 * @param edit  text of change button.
 * @param remove  text of remove button.
 * @param save  text of save button.
 * @param cancel  text of cancel button.
*/
export const enum BUTTONS {
    createEntity = "Добавить",
    edit = "Изменить",
    remove = "Удалить",
    save = "Сохранить",
    cancel = "Отмена"
}

/**
 * Text of interactions value.
 * 
 * @param buttonsTitle  title of interaction buttons.
 * @param defaultOption  value of default option.
 */
export const enum INTERACTIONS {
    buttonsTitle = "Взаимодействие",
    defaultOption = " -- Выберите опцию -- "
}

/**
 * Props for full entity page component.
 *
 * @param entity  current entity.
 * @param managementTools  app state management tools.
 */
interface FormProps {
    entity: Entity;
    managementTools: ManagementTools;
}

/**
 * Renderer the form with full entity page component.
 * 
 * @return form with full rendered entity information.
*/
export default class Form extends Component<FormProps> {
    static contextType = PartitionListContext;

    /**
     * Rendering full entity page component.
     *
     * @return a rendered page with full information about entity.
    */
    render() {
        let entity = this.props.entity;

        return (
            <div className="section-block">
                {
                    (entity.type === ENTITY_TYPES.employee && (
                        <FormEmployee
                            employee={entity as Employee}
                            saveEmployee={this.handlerSaveValidEntity.bind(this)}
                            cancelEmployee={this.cancelEntityUpdating.bind(this)}
                        />
                    ))
                    ||
                    (entity.type === ENTITY_TYPES.task && (
                        <FormTask
                            task={entity as Task}
                            saveTask={this.handlerSaveValidEntity.bind(this)}
                            cancelTask={this.cancelEntityUpdating.bind(this)}
                        />
                    ))
                    ||
                    (entity.type === ENTITY_TYPES.project && (
                        <FormProject
                            project={entity as Project}
                            saveEntity={this.handlerSaveValidEntity.bind(this)}
                            cancelProject={this.cancelEntityUpdating.bind(this)}
                        />
                    ))
                }
            </div>
        )
    }

    /**
     * Handler of saving valid entity. 
     * 
     * @param entity current saving entity.
    */
    async handlerSaveValidEntity(entity: Entity) {
        const partitionList = this.context as PartitionList;

        const partitionManipulator = new PartitionManipulator();
        const currentPartition = partitionManipulator.getPartitionByType(entity.type, partitionList);
        const newEntityID = partitionManipulator.getNewEntityID(currentPartition);

        const isAddingEntity = entity.id === newEntityID;
        if (entity.type === ENTITY_TYPES.employee) {
            if (isAddingEntity) {
                this.createEmployee(entity as Employee);
            } else {
                this.updateEmployee(entity as Employee);
            }
        }
        else if (entity.type === ENTITY_TYPES.task) {
            if (isAddingEntity) {
                this.createTask(entity as Task);
            } else {
                this.updateTask(entity as Task);
            }
        }
        else if (entity.type === ENTITY_TYPES.project) {
            if (isAddingEntity) {
                this.createProject(entity as Project);
            } else {
                this.updateProject(entity as Project);
            }
        }
        else {
            // This case will not be worked out, because EntityType is always specified.
        }

        let emptyEntity = { ...currentPartition.defaultEntity };
        this.props.managementTools.changeShow(sectionForShow.entityList, emptyEntity);
    }

    /**
     * Saving the employee being added.
     * 
     * @param employee  employee entity to add to the list in the employees partition.
    */
    async createEmployee(employee: Employee) {
        let partitionList = this.context as PartitionList;
        let employeePartition = partitionList.employees;

        if (config.useInMemory === true) {
            const storageHandler = new StorageInMemoryHandler();
            storageHandler.setEmployeeID();

            let employeeList = employeePartition.entityList;
            employeeList.push(employee);

            storageHandler.setCurrentPartition(employeePartition);
            storageHandler.setPartitionList(partitionList)
        } else {
            let employeeController = new EmployeeController();

            let entityForSave = { ...employee };
            await employeeController.create(entityForSave).then(() => {
                this.props.managementTools.updateData(employeePartition, partitionList);
            });
        }
    }

    /** 
     * Saving the task being added.
     * 
     * @param task  task entity to add to the list in the task partition.
    */
    async createTask(task: Task) {
        let partitionList = this.context as PartitionList;
        let taskPartition = partitionList.tasks;

        if (config.useInMemory === true) {
            const storageHandler = new StorageInMemoryHandler();
            storageHandler.setTaskID();

            let taskList = taskPartition.entityList;
            taskList.push(task);

            storageHandler.setCurrentPartition(taskPartition);
            storageHandler.setPartitionList(partitionList)
        } else {
            let taskController = new TaskController();

            let entityForSave = { ...task };
            await taskController.create(entityForSave).then(() => {
                this.props.managementTools.updateData(taskPartition, partitionList);
            });
        }
    }

    /**
     * Saving the project being added.
     * 
     * @param project  project entity to add to the list in the project partition.
    */
    async createProject(project: Project) {
        let partitionList = this.context as PartitionList;
        let projectPartition = partitionList.projects;

        if (config.useInMemory === true) {
            const storageHandler = new StorageInMemoryHandler();
            storageHandler.setProjectID();

            let projectList = projectPartition.entityList;
            projectList.push(project);

            storageHandler.setCurrentPartition(projectPartition);
            storageHandler.setPartitionList(partitionList)
        } else {
            let projectController = new ProjectController();

            let entityForSave = { ...project };
            await projectController.create(entityForSave).then(() => {
                this.props.managementTools.updateData(projectPartition, partitionList);
            });
        }
    }

    /**
     * Saving the edited employee. 
     * 
     * @param employee  edited employee for saving.
    */
    async updateEmployee(employee: Employee) {
        let partitionList = this.context as PartitionList;
        let employeePartition = partitionList.employees;

        if (config.useInMemory === true) {
            let employeeEntityList = employeePartition.entityList;
            const entityIndex = employeeEntityList.findIndex((entity) => entity.id === employee.id);
            employeeEntityList[entityIndex] = employee;

            const storageHandler = new StorageInMemoryHandler();
            storageHandler.setCurrentPartition(employeePartition);
            storageHandler.setPartitionList(partitionList)
        }
        else {
            let employeeController = new EmployeeController();

            let entityForSave = { ...employee };
            await employeeController.update(entityForSave.id, entityForSave).then(() => {
                this.props.managementTools.updateData(employeePartition, partitionList);
            });
        }
    }

    /**
     * Saving the edited task. 
     * 
     * @param task  edited task for saving.
    */
    async updateTask(task: Task) {
        let partitionList = this.context as PartitionList;
        let taskPartition = partitionList.tasks;

        if (config.useInMemory === true) {
            let taskEntityList = taskPartition.entityList;
            const entityIndex = taskEntityList.findIndex((entity) => entity.id === task.id);
            taskEntityList[entityIndex] = task;

            const storageHandler = new StorageInMemoryHandler();
            storageHandler.setCurrentPartition(taskPartition);
            storageHandler.setPartitionList(partitionList)
        }
        else {
            let taskController = new TaskController();

            let entityForSave = { ...task };
            await taskController.update(entityForSave.id, entityForSave).then(() => {
                this.props.managementTools.updateData(taskPartition, partitionList);
            });
        }
    }

    /**
     * Saving the edited project.
     * 
     * @param project  edited project for saving.
     */
    async updateProject(project: Project) {
        let partitionList = this.context as PartitionList;
        let projectPartition = partitionList.projects;

        if (config.useInMemory === true) {
            let projectEntityList = projectPartition.entityList;
            let entityIndex = projectEntityList.findIndex((entity) => entity.id === project.id);
            projectEntityList[entityIndex] = project;

            const storageHandler = new StorageInMemoryHandler();
            storageHandler.setCurrentPartition(projectPartition);
            storageHandler.setPartitionList(partitionList)
        }
        else {
            let projectController = new ProjectController();

            let entityForSave = { ...project };
            await projectController.update(entityForSave.id, entityForSave).then(() => {
                this.props.managementTools.updateData(projectPartition, partitionList);
            });
        }
    }

    /**
     * Cancel changes in entity and return to paginator.
     * 
     * @param currentEntity  current entity.
    */
    cancelEntityUpdating(currentEntity: Entity) {
        let partitionList = this.context as PartitionList;

        const partitionManipulator = new PartitionManipulator();
        let currentPartition = partitionManipulator.getPartitionByType(currentEntity.type, partitionList);
        if (config.useInMemory === true) {
            const storageHandler = new StorageInMemoryHandler();
            let defaultEntity = { ...currentPartition.defaultEntity };
            currentPartition.currentEntity = defaultEntity;

            storageHandler.setPartitionList(storageHandler.getPartitionList());
            storageHandler.setCurrentPartition(currentPartition);

            currentPartition = storageHandler.getCurrentPartition();
            partitionList = storageHandler.getPartitionList();
        }

        let emptyEntity = { ...currentPartition.defaultEntity };
        this.props.managementTools.changeShow(sectionForShow.entityList, emptyEntity);
    }
}