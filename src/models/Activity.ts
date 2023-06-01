import Validator from "logic/utils/Validator";
import EMPTY_INDEX from "logic/utils/EmptyIndex";
import { EntityProject, EntityParticipant } from "models/Entity";

export default interface Activity {
    id: string;
    name: string;
    description: string;
    status: ActivityStatus;
    location: string;
    dataStart: string;
    timeStart: string;
    dataEnd: string;
    timeEnd: string;
    participantList: EntityParticipant[];
    projectList: EntityProject[];
}

export const enum ActivityStatus {
    scheduled = "Запланирован",
    inProgress = "В процессе",
    completed = "Завершено",
    postponed = "Отложено",
    canceled = "Отменено",
}

export const EMPTY_ACTIVITY: Activity = {
    id: EMPTY_INDEX,
    name: "",
    description: "",
    status: ActivityStatus.canceled,
    location: "",
    dataStart: "new Validator().convertDateToText(new Date())",
    timeStart: "00:00",
    dataEnd: "new Validator().convertDateToText(new Date())",
    timeEnd: "00:00",
    participantList: [],
    projectList: [],
}

export function isValidActivity(activity: Activity): boolean {
    const validator = new Validator();

    const isValidStatus = validator.isValidActivityStatus(activity.status);
    const isValidName = !validator.isEmpty(activity.name);
    const isValidDescription = activity.description.length === 0 ? true : true;
    const isValidLocation = activity.location.length === 0 ? true : true;
    const isValidDataStart = validator.isValidDate(activity.dataStart);
    const isValidTimeStart = validator.isValidTime(activity.timeStart);
    const isValidDataEnd = validator.isValidDate(activity.dataEnd);
    const isValidTimeEnd = validator.isValidTime(activity.timeEnd);
    let isValidParticipantListID = true;
    let isValidParticipantListRole = true; 
    activity.participantList.forEach(participant => {        
        if (participant.id === "") 
            isValidParticipantListID = false;
        if (participant.role===undefined || participant.role.length===0 || !validator.isString(participant.role)) 
            isValidParticipantListRole = false;
    });

    if (!isValidName) window.alert("Некорректные данные в поле Название");
    else if (!isValidStatus) window.alert("Некорректные данные в поле Статус");
    else if (!isValidDescription) window.alert("Некорректные данные в поле Описание");
    else if (!isValidLocation) window.alert("Некорректные данные в поле Место");
    else if (!isValidDataStart) window.alert("Некорректные данные в поле Дата начала");
    else if (!isValidTimeStart) window.alert("Некорректные данные в поле Время начала");
    else if (!isValidDataEnd) window.alert("Некорректные данные в поле Дата окончания");
    else if (!isValidTimeEnd) window.alert("Некорректные данные в поле Время окончания");
    else if (!isValidParticipantListID) window.alert("Укажите ФИО участника проекта.");
    else if (!isValidParticipantListRole) window.alert("Укажите роль участника проекта.");

    return (isValidStatus 
        && isValidName && isValidDescription 
        && isValidLocation 
        && isValidDataStart && isValidTimeStart 
        && isValidDataEnd && isValidTimeEnd 
        && isValidParticipantListID && isValidParticipantListRole);
}