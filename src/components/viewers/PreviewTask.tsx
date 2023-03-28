import { Component } from "react";

import Task, { PARAMETERS_TASK } from "models/Task";
import { PartitionList } from "models/Partition";

import { PartitionListContext } from "logic/Context";
import RenderConverter from "logic/utils/RenderConverter";
import EntityValidator from 'logic/utils/EntityValidator';

/**
 * Props for renderer of preview task entity.
 * 
 * @param task  task entity.
 */
interface PreviewTaskProps {
    task: Task;
}

/**
 * Renderer of preview entity information about task.
 *
 * @return component with rendered preview entity information about task.
*/
export default class PreviewTask extends Component<PreviewTaskProps> {
    static contextType = PartitionListContext;

    /**
     * Rendering preview information about task.
     *
     * @return a rendered preview information about task entity.
    */
    render() {
        let partitionList = this.context as PartitionList;
        let task = this.props.task;

        const entityValidator = new EntityValidator();
        const employeeList = partitionList.employees.entityList;
        const employeeName = entityValidator.getTaskExecutorName(task.employeeId, employeeList);

        const projectList = partitionList.projects.entityList;
        const taskProjectName = entityValidator.getTaskProjectName(task, projectList);

        const converterForRender = new RenderConverter();

        const taskName = converterForRender.convert(task.name);
        const projectName = converterForRender.convert(taskProjectName);
        return (
            <div className="entityPreview">
                <section className="entityPreviewInfo taskPreview">
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_TASK.status}</p>
                        <p className="column-info">{task.status}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_TASK.name}</p>
                        <p className="column-info">{taskName}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_TASK.projectName}</p>
                        <p className="column-info">{projectName}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_TASK.executionTime}</p>
                        <p className="column-info">{task.executionTime}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_TASK.startDate}</p>
                        <p className="column-info">{task.startDate}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_TASK.finishDate}</p>
                        <p className="column-info">{task.finishDate}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_TASK.executor}</p>
                        <p className="column-info">{employeeName}</p>
                    </section>
                </section>
            </div>)
    }
}