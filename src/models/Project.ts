import Validator from "logic/utils/Validator";
import EMPTY_INDEX from "logic/utils/EmptyIndex";
import { EntityParticipant } from "models/Entity";

export default interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    participantList: EntityParticipant[];
}

export const enum ProjectStatus {
    scheduled = "Запланирован",
    inProgress = "В процессе",
    completed = "Завершён",
    postponed = "Отложен",
    canceled = "Отменён",
}

export const enum PARAMETERS_PROJECT {
    status = "Статус",
    name = "Наименование",
    description = "Описание",
    taskList = "Список задач проекта",
    participantList = "Список участников",
}

export const EMPTY_PROJECT: Project = {
    id: EMPTY_INDEX,
    name: "",
    description: "",
    status: ProjectStatus.canceled,
    participantList: [],
}

export function isValidProject(project: Project): boolean {
    const validator = new Validator();

    const isValidName = !validator.isEmpty(project.name);
    const isValidStatus = validator.isValidProjectStatus(project.status);
    let isValidParticipantListID = true;
    let isValidParticipantListRole = true; 
    project.participantList.forEach(participant => {        
        if (participant.id === "") 
            isValidParticipantListID = false;
        if (participant.role.length===0 || !validator.isString(participant.role)) 
            isValidParticipantListRole = false;
    });

    if (!isValidName) window.alert("Некорректные данные в поле Название");
    else if (!isValidStatus) window.alert("Некорректные данные в поле Статус");
    else if (!isValidParticipantListID) window.alert("Укажите ФИО участника проекта.");
    else if (!isValidParticipantListRole) window.alert("Укажите роль участника проекта.");

    return (isValidName && isValidStatus && isValidParticipantListID && isValidParticipantListRole);
}