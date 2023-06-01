import Member from "models/Member";
import Project from "models/Project";
import Activity from "models/Activity";

type Entity = Member | Project | Activity;

export default Entity;

export interface EntityParticipant {
    id: string;
    role: string;
}

export interface EntityParticipantView {
    id: string;
    fullName: string;
    role: string;
}

export interface EntityProject {
    id: string;
}
export interface EntityProjectView {
    id: string;
    name: string;
}

export enum PARAMETERS_ENTITY {
    // общий
    status = "Статус",
    // member
    fullName = "ФИО",
    lastName = "Фамилия",
    firstName = "Имя",
    middleName = "Отчество",
    position = "Должность",
    address = "Адрес",
    mail = "Почта",
    mobileNumber = "Мобильный телефон",
    // project + activity
    name = "Название",
    description = "Описание",
    participantList = "Список участников",
    // activity
    location = "Место",
    dataStart = "Дата начала",
    timeStart = "Время начала",
    dataEnd = "Дата окончания",
    timeEnd = "Время окончания",
    projectList = "Список проектов",
}
