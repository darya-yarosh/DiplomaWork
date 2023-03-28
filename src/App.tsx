import { Component } from 'react';
import config from "config.json";

import { PartitionListContext } from 'logic/Context';

import Entity from 'models/Entity';
import Employee from 'models/Employee';
import Project from 'models/Project';
import Task from 'models/Task';
import { Partition, PartitionList, EmployeePartition, TaskPartition, ProjectsPartition } from 'models/Partition';

import EntityList from 'components/viewers/EntityList';
import Form from 'components/forms/Form';

import PartitionManipulator from 'logic/utils/PartitionManipulator';

import StorageHandlerInMemory from 'logic/storage/in_memory/StorageInMemory';
import StorageHandlerBackend from 'logic/storage/backend/StorageBackEnd';
import EmployeeController from 'logic/storage/backend/EmployeeController';
import ProjectController from 'logic/storage/backend/ProjectController';
import TaskController from 'logic/storage/backend/TaskController';

import 'App.css';

/**
 * Name of application.
 */
const APP_TITLE = "Управление задачами";

/**
 * App state management tools.
 * 
 * @param updateData function of updating current partition and partition list in app.
 * @param changeShow function of changing the paginator and entity.
 * @param changePartition function of changing the content on page.
 */
export interface ManagementTools {
    updateData: (currentPartition: Partition, partitionList: PartitionList) => Promise<void>;
    changeShow: (showedSection: sectionForShow, entity: Entity) => void;
    changePartition: (nextPartition: Partition) => void;
}

/**
 * List of data sections to display.
 * 
 * @param entity  section of entity.
 * @param entityList  section of entity list.
 */
export const enum sectionForShow {
    entity = "Entity",
    entityList = "EntityList"
}

/**
 * State by App.
 *
 * @param isLoadedData status of data loading.
 * @param showedSection name of displayed section.
*/
export interface StateApp {
    isLoadedData: boolean;
    showedSection: sectionForShow;
}

/**
 * The main starting component.
 * 
 * @param partitionList list of all partitions.
 * @param currentPartition selected partition.
 * @param state state of main component.
 * @param managementTools app state management tools.
 * 
 * @return a component that has all the content of the site.
 */
export default class App extends Component {
    partitionList: PartitionList;
    currentPartition: Partition;
    state: StateApp;
    managementTools: ManagementTools;

    constructor(prop: any) {
        super(prop);
        this.partitionList = {
            employees: EmployeePartition,
            tasks: TaskPartition,
            projects: ProjectsPartition
        }
        this.currentPartition = { ...this.partitionList.projects };
        this.state = {
            isLoadedData: true,
            showedSection: sectionForShow.entityList,
        };
        this.managementTools = {
            updateData: this.updatePartitions.bind(this),
            changeShow: this.changeShow.bind(this),
            changePartition: this.changePartition.bind(this),
        }
    };

    async componentDidMount() {
        if (config.useInMemory === true) {
            const storageHandler = new StorageHandlerInMemory();
            if (storageHandler.isStorageEmpty()) {
                storageHandler.createData(this.currentPartition, this.partitionList);
            }
            else {
                storageHandler.loadData();
                this.currentPartition = storageHandler.getCurrentPartition();
                this.partitionList = storageHandler.getPartitionList();
                this.setState({});
            }
        }
        else {
            this.loadBackendPartitions();
        }
    }

    /**
     * Rendering the main component.
     *
     * @return a component that has all the content of the site.
    */
    render() {
        if (this.state.isLoadedData === false) {
            return (
                <div className="App">
                    <header className="App-header">
                        <h1> {APP_TITLE} </h1>
                    </header>
                    <main className="App-main" >
                        <div>Loading...</div>
                    </main>
                </div>
            )
        }
        else return (
            <div className="App">
                <header className="App-header">
                    <h1> {APP_TITLE} </h1>
                </header>
                <main className="App-main" >
                    <PartitionListContext.Provider
                        value={this.partitionList}>
                        {(this.state.showedSection === sectionForShow.entityList) && (
                            <EntityList
                                entityType={this.currentPartition.currentEntity.type}
                                managementTools={this.managementTools} />
                        )}
                        {(this.state.showedSection === sectionForShow.entity) && (
                            <Form
                                entity={this.currentPartition.currentEntity}
                                managementTools={this.managementTools} />
                        )}
                    </PartitionListContext.Provider>
                </main>
            </div>
        )
    }

    /**
     * Changing the display to entity form or entities list with saving last changes.
     *
     * @param showedSection name of section for displaying.
     * @param entity current entity.
    */
    async changeShow(showedSection: sectionForShow, entity: Entity) {
        const partitionManipulator = new PartitionManipulator();
        if (config.useInMemory === true) {
            const storageHandler = new StorageHandlerInMemory();
            let updatedCurrentPartition = storageHandler.getCurrentPartition();

            updatedCurrentPartition.currentEntity = entity;

            this.partitionList = storageHandler.getPartitionList();
            this.currentPartition = updatedCurrentPartition;

            storageHandler.setPartitionList(this.partitionList);
            storageHandler.setCurrentPartition(this.currentPartition);
        }

        const isEntitySectionShowed = showedSection === sectionForShow.entity;
        const isEntityListSectionShowed = showedSection === sectionForShow.entityList;
        if (isEntitySectionShowed) {
            if (config.useInMemory === true) {
                const storageHandler = new StorageHandlerInMemory();
                storageHandler.catchUnloading(true);
            }
        }
        else if (isEntityListSectionShowed) {
            partitionManipulator.setDefaultCurrentEntityInPartitionList(this.partitionList);
            this.setState(this.partitionList);

            if (config.useInMemory === true) {
                const storageHandler = new StorageHandlerInMemory();
                storageHandler.catchUnloading(false);
            }
        }
        else {
            // This case will not be worked out, because EntityType is always specified.
        }

        this.updatePartitions(this.currentPartition, this.partitionList);
        this.setState({ showedSection: showedSection });
    }

    /**
     * Changing current partition to another.
     *
     * @param nextPartition next current partition. 
    */
    changePartition(nextPartition: Partition) {
        this.setState(this.currentPartition = nextPartition)

        if (config.useInMemory === true) {
            const storageHandler = new StorageHandlerInMemory();
            storageHandler.setCurrentPartition(nextPartition);
        }
        this.setState({
            showEntityList: true,
            showEntity: false
        });
    }

    /**
     * Updating current partition and partition list in app, loading updates in storage.
     * 
     * @param currentPartition updated current partition.
     * @param partitionList updated list of partitions.
     */
    async updatePartitions(currentPartition: Partition, partitionList: PartitionList) {
        if (config.useInMemory === true) {
            const storageHandler = new StorageHandlerInMemory();
            storageHandler.setPartitionList(partitionList);
            storageHandler.setCurrentPartition(currentPartition);

            this.setState(this.currentPartition);
            this.setState(this.partitionList);
        }
        else {
            this.setState({ isLoadedData: false });

            let storageHandler = new StorageHandlerBackend();
            await storageHandler.updatePartitionList(partitionList).then(() => {
                this.setState(this.partitionList = partitionList);
            });

            await storageHandler.updatePartition(currentPartition).then(() => {
                this.setState(this.partitionList);
                this.setState(this.currentPartition = currentPartition);

                this.setState({ isLoadedData: true });
            });
        }
    }

    /**
     * Loading of current partition and partition list from backend storage to the application.
     */
    async loadBackendPartitions() {
        let projectController = new ProjectController();
        await projectController.getAll().then((projectList: Project[]) => {
            this.partitionList.projects.entityList = projectList;
            this.setState(this.currentPartition = this.partitionList.projects);
        });

        let taskController = new TaskController();
        await taskController.getAll().then((taskList: Task[]) => {
            this.partitionList.tasks.entityList = taskList;
        });

        let employeeController = new EmployeeController();
        await employeeController.getAll().then((employeeList: Employee[]) => {
            this.partitionList.employees.entityList = employeeList;
        });
    }
}