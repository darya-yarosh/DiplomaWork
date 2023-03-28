import { Component } from "react";

import { PartitionListContext } from "logic/Context";

import Entity from "models/Entity";
import Employee from "models/Employee";
import Task, { PARAMETERS_TASK, statusListRU } from "models/Task";
import { PartitionList } from "models/Partition";

import { DateInput } from "components/general/DateInput";
import FormNavigation from "components/forms/FormNavigation";
import { INTERACTIONS } from "components/forms/Form";

import EMPTY_INDEX from "logic/utils/EmptyIndex";
import EntityHandler from "logic/utils/EntityHandler";
import RenderConverter from "logic/utils/RenderConverter";
import EntityValidator from "logic/utils/EntityValidator";

/**
 * Patterns of task data fields.
 * 
 * @param nameLength length of the "Task name" field.
 * @param dateLength length of the "Data" field.
 * @param executionTimeLength length of the "ExecutionTime" field.
 * @param namePlaceholder the placeholder for the task name.
 * @param executionTimePlaceholder the placeholder for the task work.
 * @param datePlaceholder the placeholder for the task date.
 */
const TaskPatterns = {
    nameLength: 75,
    dateLength: 10,
    executionTimeLength: 5,
    namePlaceholder: "Задача №1",
    executionTimePlaceholder: "30",
    datePlaceholder: "ГГГГ-ММ-ДД",
}

/**
 * Props for renderer of task form.
 * 
 * @param task current task entity.
 * @param saveTask function of saving task entity.
 * @param cancelTask function of cancelinf editing task entity.
*/
interface FormTaskProps {
    task: Task;
    saveTask: (entity: Task) => void;
    cancelTask: (entity: Entity) => void;
}

/**
 * State by task form.
 * 
 * @param task task on form.
 * @param projectName task project name.
 * @param projectNameList list of project names.
 */
interface FormTaskState {
    task: Task;
    projectName: string;
    projectNameList: string[];
}

/**
 * Renderer the form with full entity information about task.
 *
 * @param isAlertVisible state of alert visibility.
 * @param isDisabledProjectName state of project name enabling.
 * @param state state of current employee form.
 * 
 * @return form with full rendered entity information.
*/
export default class FormTask extends Component<FormTaskProps> {
    static contextType = PartitionListContext;

    isAlertVisible = false;
    isDisabledProjectName = false;
    state: FormTaskState;

    constructor(props: FormTaskProps) {
        super(props);
        this.state = {
            task: { ...this.props.task },
            projectName: "",
            projectNameList: [],
        }
    }

    componentDidMount(): void {
        let updatedTask = { ...this.state.task };

        let partitionList = this.context as PartitionList;
        let projectList = partitionList.projects.entityList;

        const entityValidator = new EntityValidator();
        let updatedProjectNameList = entityValidator.getProjectNameList(projectList);
        let updatedProjectName = entityValidator.getTaskProjectName(this.state.task, projectList);
        this.setState({ projectName: updatedProjectName });

        const isTaskFromProject = partitionList.projects.currentEntity.id !== EMPTY_INDEX
        if (isTaskFromProject) {
            this.isDisabledProjectName = true;

            let taskProject = partitionList.projects.currentEntity;
            updatedProjectName = taskProject.name;
            updatedTask.projectId = taskProject.id;

            let isNewProject = projectList.find(project => project.id === taskProject.id) === undefined;
            if (isNewProject) {
                updatedProjectName = partitionList.projects.currentEntity.name;
            }
            updatedProjectNameList.unshift(updatedProjectName);
        }

        this.setState({ projectName: updatedProjectName })
        this.setState({ projectNameList: updatedProjectNameList });
        this.setState({ task: updatedTask });
    }

    /**
     * Rendering entity information about task.
     * 
     * @return a rendered information about task entity.
    */
    render() {
        const handler = new EntityHandler(() => {
            this.setAlertVisibility(false);
        });

        let partitionList = this.context as PartitionList;
        partitionList.tasks.currentEntity = this.state.task;

        let executorList = partitionList.employees.entityList;

        const entityValidator = new EntityValidator();
        let taskStatus = entityValidator.getTaskStatus(this.state.task);
        let executorName = entityValidator.getTaskExecutorName(this.state.task.employeeId, executorList);

        let keyProjectName = 0;
        let keyStatus = 0;
        return (
            <form className="entityInfo">
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_TASK.name} *
                    </label>
                    <article className="entityInfoValueText">
                        <input
                            type="text"
                            placeholder={TaskPatterns.namePlaceholder}
                            value={this.state.task.name}
                            maxLength={TaskPatterns.nameLength}
                            onChange={(event) => {
                                let updatedTask = { ...this.state.task };
                                updatedTask.name = handler.handleText(event.target.value);
                                this.setState({ task: updatedTask });
                            }}
                        />
                    </article>
                </section>
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_TASK.projectName} *
                    </label>
                    <article className="entityInfoValueText">
                        <select className="entityInfoValueSelect"
                            disabled={this.isDisabledProjectName}
                            value={this.state.projectName}
                            onChange={(event) => {
                                let updatedTask = { ...this.state.task };
                                let projectList = partitionList.projects.entityList;

                                const selectedProjectIndex = event.target.options.selectedIndex - 1;
                                updatedTask.projectId = projectList[selectedProjectIndex].id;
                                this.setState({ task: updatedTask });

                                let updatedProjectName = entityValidator.getTaskProjectName(updatedTask, projectList);
                                this.setState({ projectName: updatedProjectName });
                            }}>
                            <option disabled value={" "}>
                                {INTERACTIONS.defaultOption}
                            </option>
                            {
                                this.state.projectNameList.map(
                                    (projectName: string) => {
                                        const key = keyProjectName++;
                                        const convertedDataForRender = new RenderConverter();
                                        const projectNameWithSpaces = convertedDataForRender.convert(projectName);
                                        return (
                                            <option key={key} value={projectName}>
                                                {projectNameWithSpaces}
                                            </option>
                                        )
                                    }
                                )
                            }
                        </select>
                    </article>
                </section>
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_TASK.executionTime}
                    </label>
                    <article className="entityInfoValueText">
                        <input
                            type="text"
                            placeholder={TaskPatterns.executionTimePlaceholder}
                            value={this.state.task.executionTime}
                            maxLength={TaskPatterns.executionTimeLength}
                            onChange={(event) => {
                                let updatedTask = { ...this.state.task };
                                updatedTask.executionTime = handler.handleNumberWithValidation(event.target.value, this.state.task.executionTime);
                                this.setState({ task: updatedTask });
                            }}
                        />
                    </article>
                </section>
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_TASK.startDate}
                    </label>
                    <article className="entityInfoValueText">
                        <DateInput
                            currentDate={this.state.task.startDate}
                            setEntityDate={
                                (newDate: string) => {
                                    let updatedTask = { ...this.state.task };
                                    updatedTask.startDate = handler.handleStartDate(newDate);
                                    this.setState({ task: updatedTask });
                                }
                            }
                        />
                    </article>
                </section>
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_TASK.finishDate}
                    </label>
                    <article className="entityInfoValueText">
                        <DateInput
                            currentDate={this.state.task.finishDate}
                            setEntityDate={
                                (newDate: string) => {
                                    let updatedTask = { ...this.state.task };
                                    updatedTask.finishDate = handler.handleEndDate(newDate);
                                    this.setState({ task: updatedTask });
                                }
                            }
                        />
                    </article>
                </section>
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_TASK.status} *
                    </label>
                    <article className="entityInfoValueText">
                        <select className="entityInfoValueSelect"
                            value={taskStatus}
                            onChange={(event) => {
                                let updatedTask = { ...this.state.task };
                                updatedTask.status = handler.handleStatus(event.target.value);
                                this.setState({ task: updatedTask });
                            }}>
                            <option disabled value={" "}>
                                {INTERACTIONS.defaultOption}
                            </option>
                            {
                                Object.values(statusListRU).map(
                                    (statusValue: string) => {
                                        const key = keyStatus++;
                                        return (
                                            <option key={key}>{statusValue}</option>
                                        )
                                    }
                                )
                            }
                        </select>
                    </article>
                </section>
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_TASK.executor}
                    </label>
                    <article className="entityInfoValueText">
                        <select className="entityInfoValueSelect"
                            value={executorName}
                            onChange={(event) => {
                                let updatedTask = { ...this.state.task };
                                const selectedExecutorIndex = event.target.options.selectedIndex - 1;
                                const selectedExecutor = executorList[selectedExecutorIndex];
                                updatedTask.employeeId = (selectedExecutor !== undefined) ? selectedExecutor.id : EMPTY_INDEX;
                                this.setState({ task: updatedTask });
                            }}>
                            <option>
                                {INTERACTIONS.defaultOption}
                            </option>
                            {
                                executorList.map(
                                    (optionExecutor: Employee) => {
                                        let optionExecutorName = optionExecutor.lastName + " " + optionExecutor.firstName;
                                        if (optionExecutor.middleName !== "") {
                                            optionExecutorName += " " + optionExecutor.middleName;
                                        }
                                        return (
                                            <option key={optionExecutor.id}>
                                                {optionExecutorName}
                                            </option>
                                        )
                                    }
                                )
                            }
                        </select>
                    </article>
                </section>
                <FormNavigation
                    entity={this.state.task}
                    saveHandler={this.handlerSave.bind(this)}
                    cancelHandler={this.props.cancelTask.bind(this)}
                    isAlertVisible={this.isAlertVisible}
                />
            </form>
        )
    }

    /**
     * Handler of task entity saving. 
     * Save if entity is valid. Show alert if entity is invalid.
     */
    handlerSave() {
        let entityValidator = new EntityValidator();
        if (entityValidator.isValid(this.state.task)) {
            this.props.saveTask(this.state.task)
        }
        else {
            this.setAlertVisibility(true);
        }
        this.setState({})
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