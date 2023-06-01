import config from "config.json";

import Activity from "models/Activity";
import { PARAMETERS_ENTITY} from "models/Entity";
import { BUTTON, LABEL_CLASSNAME, VALUE_CLASSNAME } from "models/InterfaceConstants";
import ParticipantTable from "components/Tables/ParticipantTable";
import ProjectTable from "components/Tables/ProjectTable";

interface ActivityViewProps {
    activity: Activity;
    openEditForm: () => void;
    removeEntity: () => void;
}

export default function ActivityView({
    activity,
    openEditForm,
    removeEntity
}: ActivityViewProps) {
    const isAdmin = config.accessRights === "write";

    return (
        <div className="card form">
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.status}</p>
                <p className={VALUE_CLASSNAME}>{activity.status}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.name}</p>
                <p className={VALUE_CLASSNAME}>{activity.name}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.description}</p>
                <p className={VALUE_CLASSNAME}>{activity.description}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.location}</p>
                <p className={VALUE_CLASSNAME}>{activity.location}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.dataStart}</p>
                <p className={VALUE_CLASSNAME}>{activity.dataStart}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.timeStart}</p>
                <p className={VALUE_CLASSNAME}>{activity.timeStart}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.dataStart}</p>
                <p className={VALUE_CLASSNAME}>{activity.dataStart}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.timeEnd}</p>
                <p className={VALUE_CLASSNAME}>{activity.timeEnd}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.participantList}</p>
                <ParticipantTable participantList={activity.participantList}/>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.projectList}</p>
                <ProjectTable entityProjectList={activity.projectList}/>
            </span>
            {isAdmin && <span className="card-tools">
                <button type="button" className="btn btn-success" onClick={() => openEditForm()}>{BUTTON.edit}</button>
                <button type="button" className="btn btn-dangerous" onClick={() => removeEntity()}>{BUTTON.delete}</button>
            </span>}
        </div >
    )
}