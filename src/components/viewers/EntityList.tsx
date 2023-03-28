import { Component } from "react";
import config from "config.json";

import { ManagementTools, sectionForShow } from "App";
import { PartitionListContext } from "logic/Context";

import Entity, { ENTITY_TYPES } from "models/Entity";
import { PartitionList, Partition } from "models/Partition";

import StorageHandlerInMemory from "logic/storage/in_memory/StorageInMemory";
import StorageHandlerBackend from "logic/storage/backend/StorageBackEnd";
import PartitionManipulator from "logic/utils/PartitionManipulator";

import Preview from "components/viewers/Preview";
import { BUTTONS } from "components/forms/Form";

import "components/viewers/EntityList.css";

/**
 * List of system messages.
 * 
 * @param emptyEntityList message about empty entity list.
 */
const enum SYSTEM_MESSAGES {
    emptyEntityList = "Список записей пуст."
}

/**
 * Props for entity list component.
 * 
 * @param entityType type of selected entity.
 * @param managementTools app state management tools.
*/
interface EntityListProps {
    entityType: string;
    managementTools: ManagementTools;
}

/**
 * Component with entity of a selected partition.
 *
 * @return a component with partition entities.
*/
export default class EntityList extends Component<EntityListProps> {
    static contextType = PartitionListContext;

    /**
     * Rendering page with entities.
     *
     * @return a rendered page with entities.
    */
    render() {
        let partitionList = this.context as PartitionList;

        const partitionManipulator = new PartitionManipulator();
        let currentPartition = partitionManipulator.getPartitionByType(this.props.entityType, partitionList)
        let currentEntityList = currentPartition.entityList;
        return (
            <>
                <nav className="App-header-nav">
                    <div className="partition">
                        <p onClick={() => {
                            this.props.managementTools.changePartition(partitionList.projects);
                            this.setState({ currentPartition, partitionList });
                        }}>
                            {partitionList.projects.title}
                        </p>
                    </div>
                    <div className="partition">
                        <p onClick={() => {
                            this.props.managementTools.changePartition(partitionList.tasks);
                            this.setState({ currentPartition, partitionList });
                        }}>
                            {partitionList.tasks.title}
                        </p>
                    </div>
                    <div className="partition">
                        <p onClick={() => {
                            this.props.managementTools.changePartition(partitionList.employees);
                            this.setState({ currentPartition, partitionList });
                        }}>
                            {partitionList.employees.title}
                        </p>
                    </div>
                </nav>
                <div className="entityList">
                    <section className="entityListHeader">
                        <h1 className="entityListTitle">{currentPartition.title} </h1>
                        <button onClick={() => {
                            this.createEntity(currentPartition, partitionList);
                        }}>
                            {BUTTONS.createEntity}
                        </button>
                    </section>
                    <section className="pageBody">
                        {
                            (currentEntityList.length === 0 && (
                                <p className="systemMessage">{SYSTEM_MESSAGES.emptyEntityList}</p>
                            ))
                            ||
                            (currentEntityList.length > 0 && (currentEntityList.map((entity: Entity) => {
                                return (
                                    <div key={entity.id} className="entity">
                                        <Preview
                                            entity={entity}
                                        />
                                        <section className="entityPreviewNav">
                                            <button onClick={() => {
                                                currentPartition.currentEntity = entity;
                                                this.editEntity(currentPartition, partitionList);
                                            }}>
                                                {BUTTONS.edit}
                                            </button>
                                            <button onClick={() => {
                                                this.removeEntity(entity, partitionList);
                                            }}>
                                                {BUTTONS.remove}
                                            </button>
                                        </section>
                                    </div>
                                )
                            })))
                        }
                    </section>
                </div>
            </>
        );
    }

    /**
     * Creating a new entity for the list.
     * 
     * @param currentPartition partition of creating entity.
     * @param partitionList list of partitions.
    */
    createEntity(currentPartition: Partition, partitionList: PartitionList) {
        if (config.useInMemory === true) {
            let storageHandler = new StorageHandlerInMemory();
            storageHandler.setCurrentPartition(currentPartition);
            storageHandler.setPartitionList(partitionList);
            currentPartition.currentEntity.id = storageHandler.getNewEntityID(currentPartition);
        }
        else {
            let storageHandler = new StorageHandlerBackend();
            currentPartition.currentEntity.id = storageHandler.getNewEntityID(currentPartition.entityList);
        }
        this.props.managementTools.changeShow(sectionForShow.entity, currentPartition.currentEntity);
    }

    /**
     * Editing entity from the list.
     * 
     * @param currentPartition partition of editing entity.
     * @param partitionList list of partitions.
    */
    editEntity(currentPartition: Partition, partitionList: PartitionList) {
        if (config.useInMemory === true) {
            const storageHandler = new StorageHandlerInMemory();
            storageHandler.setPartitionList(partitionList);
            storageHandler.setCurrentPartition(currentPartition);
        }

        this.props.managementTools.changeShow(sectionForShow.entity, currentPartition.currentEntity);
    }

    /**
     * Deleting an entity from the list.
     *
     * @param entity selected entity to remove on page from partition entities.
     * @param partitionList list of partition.
    */
    removeEntity(entity: Entity, partitionList: PartitionList) {
        if (entity.type === ENTITY_TYPES.employee) {
            this.removeEmployee(entity.id, partitionList);
        }
        else if (entity.type === ENTITY_TYPES.task) {
            this.removeTask(entity.id, partitionList);
        }
        else if (entity.type === ENTITY_TYPES.project) {
            this.removeProject(entity.id, partitionList);
        }
    }

    /**
     * Deleting an employee entity from the list.
     * 
     * @param employeeId id of selected employee entity to remove.
     * @param partitionList list of partitions.
     */
    async removeEmployee(employeeId: string, partitionList: PartitionList) {
        if (config.useInMemory === true) {
            let storageHandler = new StorageHandlerInMemory()
            storageHandler.removeEmployee(employeeId, partitionList);

            let employeePartition = partitionList.employees;
            this.props.managementTools.updateData(employeePartition, partitionList);
        }
        else {
            let storageHandler = new StorageHandlerBackend();
            storageHandler.removeEmployee(employeeId).then(() => {
                let employeePartition = partitionList.employees;
                this.props.managementTools.updateData(employeePartition, partitionList);
            })
        }
    }

    /**
     * Deleting an task entity from the list.
     * 
     * @param taskId id of selected task entity to remove.
     * @param partitionList list of partitions.
     */
    async removeTask(taskId: string, partitionList: PartitionList) {
        if (config.useInMemory === true) {
            let storageHandler = new StorageHandlerInMemory();
            storageHandler.removeTask(taskId, partitionList);

            let taskPartition = partitionList.tasks;
            this.props.managementTools.updateData(taskPartition, partitionList);
        }
        else {
            let storageHandler = new StorageHandlerBackend();
            storageHandler.removeTask(taskId).then(() => {
                let taskPartition = partitionList.tasks;
                this.props.managementTools.updateData(taskPartition, partitionList);
            });
        }
    }

    /**
     * Deleting an project entity from the list.
     * 
     * @param projectId id of selected task entity to remove.
     * @param partitionList list of partitions.
     */
    async removeProject(projectId: string, partitionList: PartitionList) {
        if (config.useInMemory === true) {
            let storageHandler = new StorageHandlerInMemory();
            storageHandler.removeProject(projectId, partitionList);

            let projectPartition = partitionList.projects;
            this.props.managementTools.updateData(projectPartition, partitionList);
        }
        else {
            let storageHandler = new StorageHandlerBackend();
            storageHandler.removeProject(projectId, partitionList).then(() => {
                let projectPartition = partitionList.projects;
                this.props.managementTools.updateData(projectPartition, partitionList)
            });
        }
    }
}