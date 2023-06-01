import config from "config.json";

import Project, { PARAMETERS_PROJECT } from "models/Project";
import { BUTTON } from "models/InterfaceConstants";

interface ProjectCardProps {
    project: Project;
    openProjectPage: (projectId: string) => void;
}

export default function ProjectCard({
    project,
    openProjectPage,
}: ProjectCardProps) {
    return (
        <div className="card">
            <span>
                <p className="field-header">{PARAMETERS_PROJECT.status}</p>
                <p className="field-value">{project.status}</p>
            </span>
            <span className="field-name">
                <p className="field-header">{PARAMETERS_PROJECT.name}</p>
                <p className="field-value">{project.name}</p>
            </span>
            <span>
                <button className="btn btn-success" onClick={() => openProjectPage(project.id)}>{BUTTON.open}</button>
            </span>
        </div>
    )
}