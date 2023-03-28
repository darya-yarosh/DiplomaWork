import { Component } from "react";

import Project, { PARAMETERS_PROJECT } from "models/Project";
import Task, { PARAMETERS_TASK } from "models/Task";
import { PartitionList } from "models/Partition";

import { PartitionListContext } from "logic/Context";
import EntityValidator from "logic/utils/EntityValidator";

import { INTERACTIONS, BUTTONS } from "components/forms/Form";

/**
 * Props for the project tasks list component
 * 
 * @param projectTaskList project task list.
 * @param createTask function of creating task for project.
 * @param editTask function of editing task of project.
 * @param removeTask function of removing project task.
 */
interface ProjectTaskProps {
    projectTaskList: Task[];
    createTask: (project: Project) => void;
    editTask: (task: Task, project: Project, partitionList: PartitionList) => void;
    removeTask: (taskId: string) => void;
}

/**
 * Component of project tasks list.
 * 
 * @return a component of project tasks list.
 */
export default class ProjectTaskList extends Component<ProjectTaskProps> {
    static contextType = PartitionListContext;

    /**
     * Rendering the component of project tasks list.
     *
     * @return the project tasks list component.
    */
    render() {
        const entityValidator = new EntityValidator();

        let partitionList = this.context as PartitionList;
        let projectPartition = partitionList.projects;
        let project = projectPartition.currentEntity;
        return (
            <section className="entityInfoLine">
                <label className="entityInfoParameter">
                    {PARAMETERS_PROJECT.taskList}
                </label>
                <article>
                    {
                        (this.props.projectTaskList.length !== 0) && (
                            <table className="entityInfoValueTable">
                                <tbody>
                                    <tr>
                                        <th>{PARAMETERS_TASK.status}</th>
                                        <th>{PARAMETERS_TASK.name}</th>
                                        <th>{PARAMETERS_TASK.executionTime}</th>
                                        <th>{PARAMETERS_TASK.startDate}</th>
                                        <th>{PARAMETERS_TASK.finishDate}</th>
                                        <th>{PARAMETERS_TASK.executor}</th>
                                        <th>{INTERACTIONS.buttonsTitle}</th>
                                    </tr>
                                    <>
                                        {
                                            this.props.projectTaskList.map((task: Task) => {
                                                let employeeList = partitionList.employees.entityList;
                                                const taskExecutorName = entityValidator.getTaskExecutorName(task.employeeId, employeeList);
                                                return (
                                                    <tr key={task.id}>
                                                        <td className="previewInfo">{task.status}</td>
                                                        <td className="previewInfo">{task.name}</td>
                                                        <td className="previewInfo">{task.executionTime}</td>
                                                        <td className="previewInfo">{task.startDate}</td>
                                                        <td className="previewInfo">{task.finishDate}</td>
                                                        <td className="previewInfo">{taskExecutorName}</td>
                                                        <td>
                                                            <button className="taskButtons"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.props.editTask(task, project, partitionList);
                                                                }}>
                                                                {BUTTONS.edit}
                                                            </button>
                                                            <button className="taskButtons"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.props.removeTask(task.id);
                                                                    this.setState({});
                                                                }}>
                                                                {BUTTONS.remove}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </>
                                </tbody>
                            </table>
                        )
                    }
                    <button className="sub-button"
                        type="button"
                        onClick={() => {
                            this.props.createTask(project);
                        }}>
                        {BUTTONS.createEntity}
                    </button>
                </article>
            </section>
        )
    }
}