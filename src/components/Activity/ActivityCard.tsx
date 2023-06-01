import config from "config.json"

import Activity from "models/Activity";
import { PARAMETERS_ENTITY } from "models/Entity";
import { BUTTON } from "models/InterfaceConstants";

interface ActivityCardProps {
    activity: Activity;
    openActivityPage: (activityId: string) => void;
}

export default function ActivityCard({
    activity,
    openActivityPage,
}: ActivityCardProps) {
    return (
        <div className="card">
            <span>
                <p className="field-header">{PARAMETERS_ENTITY.status}</p>
                <p className="field-value">{activity.status}</p>
            </span>
            <span className="field-name">
                <p className="field-header">{PARAMETERS_ENTITY.name}</p>
                <p className="field-value">{activity.name}</p>
            </span>
            <span>
                <button className="btn btn-success" onClick={() => openActivityPage(activity.id)}>{BUTTON.open}</button>
            </span>
        </div>
    )
}