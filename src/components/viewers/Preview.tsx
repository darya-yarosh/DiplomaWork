import { Component } from "react";

import Entity, { ENTITY_TYPES } from "models/Entity";
import Employee from "models/Employee";
import Project from "models/Project";
import Task from "models/Task";

import PreviewEmployee from "components/viewers/PreviewEmployee";
import PreviewTask from "components/viewers/PreviewTask";
import PreviewProject from "components/viewers/PreviewProject";

import "components/viewers/Preview.css";

/**
 * Props for renderer of preview entity.
 *
 * @param entity  current entity.
*/
interface PreviewProps {
    entity: Entity;
}

/**
 * Renderer of preview information of selected entity.
 *
 * @return component with rendered preview information of selected entity.
*/
export default class Preview extends Component<PreviewProps> {
    /**
     * Rendering preview entity information.
     * 
     * @return a rendered preview information about selected entity.
    */
    render() {
        return (
            <>
                {
                    (this.props.entity.type === ENTITY_TYPES.employee && (
                        <PreviewEmployee employee={this.props.entity as Employee} />
                    ))
                    ||
                    (this.props.entity.type === ENTITY_TYPES.task && (
                        <PreviewTask task={this.props.entity as Task} />
                    ))
                    ||
                    (this.props.entity.type === ENTITY_TYPES.project && (
                        <PreviewProject project={this.props.entity as Project} />
                    ))
                }
            </>
        )
    }
}