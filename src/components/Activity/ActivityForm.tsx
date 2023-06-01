import { useState } from "react";
import Validator from '../../logic/utils/Validator';

import EMPTY_INDEX from "logic/utils/EmptyIndex";
import Activity, { ActivityStatus, EMPTY_ACTIVITY, isValidActivity } from "models/Activity";
import { PARAMETERS_ENTITY, EntityProject, EntityParticipant } from "models/Entity";
import { BUTTON } from "models/InterfaceConstants";
import ParticipantTableForm from "components/Tables/ParticipantTableForm";
import ProjectTableForm from "components/Tables/ProjectTableForm";

interface ActivityFormProps {
    activityObject: Activity,
    updateEntity: (activity: Activity) => void;
    closeEditForm: () => void;
}



export default function ActivityForm({
    activityObject = EMPTY_ACTIVITY,
    updateEntity,
    closeEditForm,
}: ActivityFormProps) {
    const [activity, setActivity] = useState({ ...activityObject })

    function submitActivity() {
        if (!isValidActivity(activity)) {
            return;
        }
        
        updateEntity(activity);
    }

    
    function handlerUpdateStatus(newStatus: string) {
        const validator = new Validator();
        
        if (!validator.isValidActivityStatus(newStatus)) {
            window.alert("Некорректный статус: попробуйте снова.")
        }
        const validStatus = validator.formatStrToActivityStatus(newStatus);

        const updatedActivity = { ...activity };
        updatedActivity.status = validStatus;
        setActivity(updatedActivity);
    }
    function handlerUpdateName(newName: string) {
        const updatedActivity = { ...activity };
        updatedActivity.name = newName;
        setActivity(updatedActivity);
    }
    function handlerUpdateDescription(newDescription: string) {
        const updatedActivity = { ...activity };
        updatedActivity.description = newDescription;
        setActivity(updatedActivity);
    }
    function handlerUpdateLocation(newLocation: string) {
        const updatedActivity = { ...activity };
        updatedActivity.location = newLocation;
        setActivity(updatedActivity);
    }
    function handlerUpdateDateStart(newDateStart: string) {
        const updatedActivity = { ...activity };
        updatedActivity.dataStart = newDateStart;
        setActivity(updatedActivity);
    }
    function handlerUpdateDateEnd(newDateEnd: string) {
        const updatedActivity = { ...activity };
        updatedActivity.dataEnd = newDateEnd;
        setActivity(updatedActivity);
    }
    function handlerUpdateTimeStart(newTimeStart: string) {
        const updatedActivity = { ...activity };
        updatedActivity.timeStart = newTimeStart;
        setActivity(updatedActivity);
    }
    function handlerUpdateTimeEnd(newTimeEnd: string) {
        const updatedActivity = { ...activity };
        updatedActivity.timeEnd = newTimeEnd;
        setActivity(updatedActivity);
    }
    const statusList = [
        ActivityStatus.canceled,
        ActivityStatus.completed,
        ActivityStatus.inProgress,
        ActivityStatus.postponed,
        ActivityStatus.scheduled
    ]
    function updateParticipantList(participantList: EntityParticipant[]) {
        activity.participantList = participantList;
    }
    function updateProjectList(projectList: EntityProject[]) {
        activity.projectList = projectList;
    }
    return (
        <form className="card form" onSubmit={(event) => event.preventDefault()}>
            <span>
                <label className="field-header">Статус</label>
                <select id="status-list" onChange={(event) => handlerUpdateStatus(event.target.value)}>
                    {statusList.map((status) => <option key={status} value={status} selected={activity.status === status}>{status}</option>)}
                </select>

            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.name}</label>
                <input className="field-input" type="text" value={activity.name} onChange={(event) => handlerUpdateName(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.description}</label>
                <textarea className="field-input" value={activity.description} onChange={(event) => handlerUpdateDescription(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.location}</label>
                <input className="field-input" type="text" value={activity.location} onChange={(event) => handlerUpdateLocation(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.dataStart}</label>
                <input className="field-input" type="date" value={activity.dataStart} onChange={(event) => handlerUpdateDateStart(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.timeStart}</label>
                <input className="field-input" type="time" value={activity.timeStart} onChange={(event) => handlerUpdateTimeStart(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.dataEnd}</label>
                <input className="field-input" type="date" value={activity.dataEnd} onChange={(event) => handlerUpdateDateEnd(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.timeEnd}</label>
                <input className="field-input" type="time" value={activity.timeEnd} onChange={(event) => handlerUpdateTimeEnd(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.participantList}</label>
                <ParticipantTableForm entityParticipantList={activity.participantList} updateParticipantList={updateParticipantList} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.projectList}</label>
                <ProjectTableForm entityProjectList={activity.projectList} updateProjectList={updateProjectList} />
            </span>
            <span>
                <button className="btn btn-success" type="button" onClick={submitActivity}>{BUTTON.save}</button>
                {activity.id !== EMPTY_INDEX && <button className="btn btn-dangerous" type="button" onClick={closeEditForm}>{BUTTON.cancel}</button>}
            </span>
        </form>)
}