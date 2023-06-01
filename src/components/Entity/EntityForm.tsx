import Activity, { ActivityStatus, EMPTY_ACTIVITY } from "models/Activity";
import { BUTTON } from "models/InterfaceConstants";
import { useState } from "react";

interface EntityFormProps {
    activityObject: Activity
}

export default function EntityForm({
    activityObject = EMPTY_ACTIVITY,
}: EntityFormProps) {
    const [activity, setActivity] = useState({...activityObject})

    function isValidStatus(status: string) {
        return status === ActivityStatus.canceled
        || status === ActivityStatus.completed
        || status === ActivityStatus.inProgress
        || status === ActivityStatus.postponed
        || status === ActivityStatus.scheduled;
    }

    function formatStrToStatus(status: string) {
        if (status === ActivityStatus.canceled) return ActivityStatus.canceled;
        if (status === ActivityStatus.completed) return ActivityStatus.completed;
        if (status === ActivityStatus.inProgress) return ActivityStatus.inProgress;
        if (status === ActivityStatus.postponed) return ActivityStatus.postponed;
        if (status === ActivityStatus.scheduled) return ActivityStatus.scheduled;
        return ActivityStatus.canceled;
    }

    function handlerUpdateStatus(newStatus: string) {
        if (!isValidStatus(newStatus)) {
            window.alert("Некорректный статус: попробуйте снова.")
        }
        const validStatus = formatStrToStatus(newStatus);

        const updatedActivity = { ...activity };
        updatedActivity.status = validStatus;
        setActivity(updatedActivity);
    }
    function handlerUpdateName(newName: string) {
        const updatedActivity = { ...activity };
        updatedActivity.name = newName;
        setActivity(updatedActivity);
    }

    const statusList = [
        ActivityStatus.canceled, 
        ActivityStatus.completed, 
        ActivityStatus.inProgress, 
        ActivityStatus.postponed, 
        ActivityStatus.scheduled
    ]
    const dataStart = "";
    const dataEnd = "";

    return <form onSubmit={(event) => event.preventDefault()}>
        <span>
            <label className="field-header">Статус</label>
            <select id="status-list" onChange={(event) => handlerUpdateStatus(event.target.value)}>
                {statusList.map((status) => <option key={status} value={status} selected={activity.status === status}/>)}
            </select>

        </span>
        <span>
            <label className="field-header">Название</label>
            <input className="field-input" type="text" value={activity.name} onChange={(event)=>handlerUpdateName(event.target.value)}/>
        </span>
        <span>
            <label className="field-header">Описание</label>
            <input className="field-input" value={activity.description}/>
        </span>
        <span>
            <label className="field-header">Место проведения</label>
            <input className="field-input" value={activity.location}/>
        </span>
        <span>
            <label className="field-header">Дата начала</label>
            <input className="field-input" value={dataStart} />
        </span>
        <span>
            <label className="field-header">Дата окончания</label>
            <input className="field-input" value={dataEnd} />
        </span>
        <span>
            <button className="btn btn-primary" type="submit">{BUTTON.save}</button>
        </span>
    </form>
}