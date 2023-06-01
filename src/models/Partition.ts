import Entity from "models/Entity";
import { MemberPosition, MemberStatus } from "models/Member";
import { ProjectStatus } from "models/Project";
import { ActivityStatus } from "models/Activity";

export interface Partition {
    id: string;
    title: string;
    entityList: Entity[]
}

export interface PartitionList {
    [key: string]: Partition,
    members: Partition,
    projects: Partition,
    activities: Partition,
}

export const DEFAULT_PARTITION_LIST: PartitionList = {
    'members': {
        id: "members",
        title: "Участники",
        entityList: [],
    },
    'projects':{
        id: "projects",
        title: "Проекты",
        entityList: [],
    },
    'activities': {
        id: "activities",
        title: "События",
        entityList: [],
    }
}

export const TEST_PARTITION_LIST: PartitionList = {
    'members': {
        id: "members",
        title: "Участники",
        entityList: [
            {
                id: "8P2euFYLNai5QUvAYFBk",
                lastName: "Ярош",
                firstName: "Дарья",
                middleName: "Сергеевна",
                status: MemberStatus.inactive,
                position: MemberPosition.student,
                mobileNumber: "",
                mail: "",
                address: "",
            },
            {
                id: crypto.randomUUID(),
                lastName: "Камаева",
                firstName: "Мария",
                middleName: "Ивановна",
                status: MemberStatus.active,
                position: MemberPosition.teacher,
                mobileNumber: "",
                mail: "",
                address: "",
            },
            {
                id: "57aUtPAetxMloHzXKehx",
                lastName: "Иванов",
                firstName: "Иван",
                middleName: "Иванович",
                status: MemberStatus.active,
                position: MemberPosition.other,
                mobileNumber: "",
                mail: "",
                address: "",
            },
        ],
    },
    'activities':{
        id: "activities",
        title: "События",
        entityList: [
            {
                id: crypto.randomUUID(),
                name: "Первокурсник ФИТР",
                description: "Мероприятие по активностям первашей.",
                status: ActivityStatus.canceled,
                location: "Минск, БНТУ, 11 корпус",
                dataStart: "",
                timeStart: "",
                dataEnd: "",
                timeEnd: "",
                participantList: [
                    {id: "8P2euFYLNai5QUvAYFBk", role: "Организатор"}
                ],
                projectList: [],
              },
              {
                id: crypto.randomUUID(),
                name: "Мистер БНТУ",
                description: "Весеннее мероприятие для мужской половины студентов университета.",
                status: ActivityStatus.completed,
                location: "Минск, БНТУ, 1 корпус",
                dataStart: "",
                timeStart: "",
                dataEnd: "",
                timeEnd: "",
                participantList: [
                    {id: "8P2euFYLNai5QUvAYFBk", role: "Организатор"}
                ],
                projectList: [
                    {id: "REOsa68xl32KBgoCA0bg"},
                ],
              },
              {
                id: crypto.randomUUID(),
                name: "День открытых дверей",
                description: "Мероприятие по ознакомлению абитуриентов с культурой и структурой университета.",
                status: ActivityStatus.scheduled,
                location: "Минск, БНТУ",
                dataStart: "",
                timeStart: "",
                dataEnd: "",
                timeEnd: "",
                participantList: [
                    {id: "8P2euFYLNai5QUvAYFBk", role: "Организатор"}
                ],
                projectList: [
                    {id: "9hAguSoc653eQt2TmrMm"}
                ],
              },
        ],
    },
    'projects': {
        id: "projects",
        title: "Проекты",
        entityList: [
            {
                id: "REOsa68xl32KBgoCA0bg",
                name: "Проект №1",
                description: "Описание проекта 1 крайне длинное на мой взгляд, но в тоже время не очень.",
                status: ProjectStatus.inProgress,
                participantList: [
                    {id: "57aUtPAetxMloHzXKehx", role: "Руководитель"}
                ],
            },
            {
                id: "9hAguSoc653eQt2TmrMm",
                name: "Проект №2",
                description: "Описание проекта 2 краткое - и на том спасибо.",
                status: ProjectStatus.postponed,
                participantList: [
                    {id: "57aUtPAetxMloHzXKehx", role: "Руководитель"}
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Проект №3",
                description: "Описание проекта 3.",
                status: ProjectStatus.scheduled,
                participantList: [
                    {id: "57aUtPAetxMloHzXKehx", role: "Руководитель"}
                ],
            },
            {
                id: crypto.randomUUID(),
                name: "Проект №4",
                description: "Описание проекта 4.",
                status: ProjectStatus.scheduled,
                participantList: [
                    {id: "57aUtPAetxMloHzXKehx", role: "Руководитель"}
                ],
            },
        ],
    }
}