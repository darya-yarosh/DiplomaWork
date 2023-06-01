import config from "config.json";

import Project from "models/Project";
import { PARAMETERS_ENTITY, } from "models/Entity";
import { BUTTON, LABEL_CLASSNAME, VALUE_CLASSNAME } from "models/InterfaceConstants";
import ParticipantTable from "components/Tables/ParticipantTable";

interface ProjectViewProps {
    project: Project;
    openEditForm: () => void;
    removeEntity: () => void;
}

export default function ProjectView({
    project,
    openEditForm,
    removeEntity
}: ProjectViewProps) {
    const isAdmin = config.accessRights === "write";

    return (
        <div className="card form">
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.status}</p>
                <p className={VALUE_CLASSNAME}>{project.status}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.name}</p>
                <p className={VALUE_CLASSNAME}>{(project.name)}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.description}</p>
                <p className={VALUE_CLASSNAME}>{(project.description)}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.participantList}</p>
                <ParticipantTable participantList={project.participantList}/>
            </span>
            {isAdmin && <span className="card-tools">
                <button type="button" className="btn btn-success" onClick={() => openEditForm()}>{BUTTON.edit}</button>
                <button type="button" className="btn btn-dangerous" onClick={() => removeEntity()}>{BUTTON.delete}</button>
            </span>}
        </div>
    )
}