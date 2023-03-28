import { Component } from "react";
import config from "config.json";

import { PartitionListContext } from "logic/Context";

import Entity, { DEFAULT_EMPTY_ENTITY, ENTITY_TYPES } from "models/Entity";
import Project, { PARAMETERS_PROJECT } from "models/Project";
import Task from "models/Task";
import { PartitionList } from "models/Partition";

import FormNavigation from "components/forms/FormNavigation";
import TaskTable from "components/viewers/TaskTable";
import FormTask from "components/forms/FormTask";

import StorageInMemoryHandler from "logic/storage/in_memory/StorageInMemory";
import ProjectController from "logic/storage/backend/ProjectController";
import TaskController from "logic/storage/backend/TaskController";

import EntityValidator from "logic/utils/EntityValidator";
import EntityHandler from "logic/utils/EntityHandler";

import "components/viewers/Preview.css";
import "components/viewers/TaskTable.css";

/**
 * Patterns of project data fields.
 * 
 * @param namePlaceholder the placeholder for the project name.
 * @param descriptionPlaceholder the placeholder for the project description.
 * @param nameLength length of the "Project field.
 * @param descriptionLength length of the "Description" field.
 */
const ProjectPatters = {
    namePlaceholder: "Проект №1",
    descriptionPlaceholder: "Описание проекта №1.",
    nameLength: 75,
    descriptionLength: 255
}

/**
 * Props for renderer of project form.
 * 
 * @param project current project entity.
 * @param saveTask function of saving project entity.
 * @param cancelTask function of cancelinf editing project entity.
 */
interface FormProjectProps {
    project: Project;
    saveEntity: (entity: Entity) => Promise<void>;
    cancelProject: (entity: Entity) => void;
}

/**
 * State by project form.
 * 
 * @param project project on form.
 * @param projectTaskList list of tasks by current project.
 * @param isShowedForm status of displayin of project task form.
 * @param projectTaskOpen status of opening the task form.
 */
interface FormProjectState {
    project: Project;
    projectTaskList: Task[];
    isShowedForm: string;
    projectTaskOpen: Task;
}

/**
 * Renderer the form with full entity information about project.
 *
 * @param isAlertVisible state of alert visibility.
 * @param state state of current project form.
 * @param getShowedForm getter for type of showing form;
 * @param setShowedForm setter for type of showing form;
 * 
 * @return form with full rendered entity information.
*/
export default class FormProject extends Component<FormProjectProps> {
    static contextType = PartitionListContext;
    isAlertVisible = false;

    state: FormProjectState;

    constructor(props: FormProjectProps) {
        super(props);
        this.state = {
            project: this.props.project,
            projectTaskList: [],
            isShowedForm: ENTITY_TYPES.project,
            projectTaskOpen: DEFAULT_EMPTY_ENTITY.task,
        }
        this.getShowedForm = this.getShowedForm.bind(this);
        this.setShowedForm = this.setShowedForm.bind(this);
    }

    componentDidMount(): void {
        let partitionList = this.context as PartitionList;
        let entityValidator = new EntityValidator();

        const projectID = this.props.project.id;
        let taskList = partitionList.tasks.entityList;

        let loadedProjectTaskList = entityValidator.getProjectTasksList(projectID, taskList);
        loadedProjectTaskList = Object.values(loadedProjectTaskList)
        this.setState({ projectTaskList: loadedProjectTaskList });
        this.setState({});
    }

    /**
     * Rendering entity information about project.
     * 
     * @return a rendered information about project entity.
    */
    render() {
        const handler = new EntityHandler(() => {
            this.setAlertVisibility(false);
        });

        let partitionList = this.context as PartitionList;
        partitionList.projects.currentEntity = this.state.project;
        return (
            <div>
                {(this.getShowedForm() === ENTITY_TYPES.project) &&
                    <form id="formProject" className="entityInfo">
                        <section className="entityInfoLine">
                            <label className="entityInfoParameter">
                                {PARAMETERS_PROJECT.name} *
                            </label>
                            <article className="entityInfoValueText">
                                <input
                                    type="text"
                                    placeholder={ProjectPatters.namePlaceholder}
                                    id={"projectName"}
                                    value={this.state.project.name}
                                    maxLength={ProjectPatters.nameLength}
                                    onChange={(event) => {
                                        let updatedProject = { ...this.state.project };
                                        updatedProject.name = handler.handleText(event.target.value);

                                        this.setState({ project: updatedProject });
                                    }} />
                            </article>
                        </section>
                        <section className="entityInfoLine">
                            <label className="entityInfoParameter">
                                {PARAMETERS_PROJECT.description}
                            </label>
                            <article className="entityInfoValueText">
                                <input
                                    type="text"
                                    placeholder={ProjectPatters.descriptionPlaceholder}
                                    id={"description"}
                                    value={this.state.project.description}
                                    maxLength={ProjectPatters.descriptionLength}
                                    onChange={(event) => {
                                        let updatedProject = { ...this.state.project };
                                        updatedProject.description = handler.handleText(event.target.value);

                                        this.setState({ project: updatedProject });
                                    }} />
                            </article>
                        </section>
                        <TaskTable
                            projectTaskList={this.state.projectTaskList}
                            createTask={this.createTaskFromProject.bind(this)}
                            editTask={this.editTaskFromProject.bind(this)}
                            removeTask={this.removeTaskFromProject.bind(this)}
                        />
                        <FormNavigation
                            entity={this.state.project}
                            saveHandler={this.handlerSave.bind(this)}
                            cancelHandler={this.props.cancelProject.bind(this)}
                            isAlertVisible={this.isAlertVisible}
                        />
                    </form>
                }
                {(this.getShowedForm() === ENTITY_TYPES.task) &&
                    <FormTask
                        task={this.state.projectTaskOpen}
                        saveTask={this.saveTask.bind(this)}
                        cancelTask={this.cancelTask.bind(this)}
                    />
                }
            </div>
        )
    }

    /**
     * Handler of project entity saving. 
     * Save if entity is valid. Show alert if entity is invalid.
     */
    handlerSave() {
        let entityValidator = new EntityValidator();
        if (entityValidator.isValid(this.state.project)) {
            this.props.saveEntity(this.state.project).then(() => {
                if (config.useInMemory === true) {
                    this.saveUpdatedTaskList(this.state.projectTaskList);
                }
                else {
                    let projectController = new ProjectController();
                    projectController.getAll().then((projectList: Project[]) => {
                        let currentProject = this.state.project;
                        let foundedProject = projectList.find(project => project.id === currentProject.id);
                        if (foundedProject === undefined) {
                            currentProject = projectList[projectList.length - 1];
                        }

                        this.state.projectTaskList.forEach(task => task.projectId = currentProject.id);

                        this.saveUpdatedTaskList(this.state.projectTaskList);
                    })
                }
            });
        }
        else {
            this.setAlertVisibility(true);
        }
        this.setState({})
    }

    /**
     * Saving updated task list of project. 
     * Uploaded changes in main task list.
     * 
     * @param updatedProjectTaskList updated list of project tasks.
     */
    saveUpdatedTaskList(updatedProjectTaskList: Task[]) {
        this.updateSavedTasks(updatedProjectTaskList);
        this.updateRemovedTasks(updatedProjectTaskList);
    }

    /**
     * Saving project tasks in main task list.
     * 
     * @param updatedProjectTaskList updated list of project tasks.
     */
    updateSavedTasks(updatedProjectTaskList: Task[]) {
        updatedProjectTaskList.forEach((projectTask) => {
            this.props.saveEntity(projectTask);
        })
    }

    /**
     * Removing project tasks from main task list.
     * 
     * @param updatedProjectTaskList updated list of project tasks.
     */
    updateRemovedTasks(updatedProjectTaskList: Task[]) {
        let partitionList = this.context as PartitionList;

        let projectTaskList = partitionList.tasks.entityList.filter(task => task.projectId === this.props.project.id)
        projectTaskList.forEach(async task => {
            let projectTask = updatedProjectTaskList.find(updatedtask => task.id === updatedtask.id);
            if (projectTask === undefined) {
                let deletedTaskId = task.id;
                partitionList.tasks.entityList = partitionList.tasks.entityList.filter(task => task.id !== deletedTaskId);
                if (config.useInMemory === false) {
                    let taskController = new TaskController();
                    await taskController.delete(deletedTaskId);
                }
            }
        })
    }
    /**
     * Creating task from project.
     * 
     * @param project  current project.
     */
    createTaskFromProject(project: Project) {
        const isValidProjectName = (project.name.trim() !== "") || (project.name.trim().length !== 0);
        if (isValidProjectName) {
            let partitionList = this.context as PartitionList;
            let projectList = partitionList.projects.entityList;
            const projectIndex = projectList.findIndex((entity) => entity.id === project.id);
            let projectFromList = (projectList[projectIndex] !== undefined) ? projectList[projectIndex] : project;
            projectList[projectIndex] = projectFromList;

            let taskPartition = partitionList.tasks;
            let newTask = { ...taskPartition.defaultEntity };

            newTask.projectId = project.id;
            partitionList.projects.currentEntity = this.state.project;
            if (config.useInMemory === true) {
                if (this.state.projectTaskList.length === 0) {
                    let storageHandler = new StorageInMemoryHandler();
                    newTask.id = storageHandler.getNewEntityID(taskPartition);
                }
                else {
                    newTask.id = (Number(this.state.projectTaskList[this.state.projectTaskList.length - 1].id) + 1).toString();
                }
                taskPartition.currentEntity = newTask;

                this.setState({ projectTaskOpen: newTask });
                this.setShowedForm(ENTITY_TYPES.task);
            }
            else {
                let currentTaskID = newTask.id;

                let mainTaskList = partitionList.tasks.entityList;
                let foundedMainTask = mainTaskList.find(task => task.id === currentTaskID);
                if (foundedMainTask !== undefined) {
                    let lastMainTaskID = Number(mainTaskList[mainTaskList.length - 1].id);
                    currentTaskID = (lastMainTaskID + 1).toString();
                }
                let foundedProjectTask = this.state.projectTaskList.find(task => task.id === currentTaskID);
                if (foundedProjectTask !== undefined) {
                    let lastProjectTaskID = Number(this.state.projectTaskList[this.state.projectTaskList.length - 1].id);
                    if (currentTaskID < (lastProjectTaskID + 1).toString()) {
                        currentTaskID = (lastProjectTaskID + 1).toString();
                    }
                }

                newTask.id = currentTaskID;

                taskPartition.currentEntity = newTask;

                this.setState({ projectTaskOpen: newTask });
                this.setShowedForm(ENTITY_TYPES.task);
            }
        }
        else {
            this.setAlertVisibility(true);
        }
        this.setState({});
    }

    /**
     * Editing task from project.
     * 
     * @param task  task being edited from project.
     */
    editTaskFromProject(task: Task) {
        let partitionList = this.context as PartitionList;
        partitionList.projects.currentEntity = this.state.project;

        this.setState({ projectTaskOpen: task })
        this.setShowedForm(ENTITY_TYPES.task);
    }

    /**
     * Remove task from project tasks list.
     *
     * @param taskId id of the task being deleted.
    */
    removeTaskFromProject(taskId: string) {
        this.setState({ projectTaskList: this.state.projectTaskList.filter((entity) => entity.id !== taskId) });
    }

    /**
     * Saving the project task.
     * 
     * @param task project task.
     */
    saveTask(task: Task) {
        let entityValidator = new EntityValidator();
        if (entityValidator.isValid(task)) {
            let taskIndex = this.state.projectTaskList.findIndex((projectTask) => projectTask.id === task.id);
            if (taskIndex === -1) {
                this.state.projectTaskList.push(task);
            }
            else {
                let updatedProjectTaskList = this.state.projectTaskList;
                updatedProjectTaskList[taskIndex] = task;
                this.setState({ projectTaskList: updatedProjectTaskList });
            }
            this.cancelTask();
        }
        else {
            this.setAlertVisibility(true);
        }
        this.setState({})
    }

    /**
     * Cancelation of editing project task.
     */
    cancelTask() {
        this.setState({ projectTaskOpen: DEFAULT_EMPTY_ENTITY.task });
        this.setShowedForm(ENTITY_TYPES.project);
    }

    /**
     * Setter for showed form status.
     * 
     * @param status name of current showed form: "Project" or "Task".
     */
    setShowedForm(status: string) {
        this.setState({ isShowedForm: status });
    }

    /**
     * Getter of showed form status.
     * 
     * @returns showed form name.
     */
    getShowedForm() {
        return this.state.isShowedForm;
    }

    /**
     * Setter of boolean value of alert message visibility.
     * 
     * @param isVisibility  new alert message visibility status.
     */
    setAlertVisibility(isVisibility: boolean) {
        this.isAlertVisible = isVisibility;
    }
}