import { handleGetMember } from "logic/storage/firebase/MembersController";
import { handleGetProject } from "logic/storage/firebase/ProjectsController";
import Activity from "models/Activity";
import Entity, { EntityParticipant, EntityParticipantView, EntityProject, EntityProjectView } from "models/Entity";
import Member from "models/Member";
import Project from "models/Project";

export function getFilteredEntityList(entityList: Entity[], entityType: string, filter: string) {
    if (entityType === "members") return getFilteredMemberList(entityList as Member[], filter);
    else if (entityType === "projects") return getFilteredProjectList(entityList as Project[], filter);
    else if (entityType === "activities") return getFilteredActivityList(entityList as Activity[], filter);

    return [];
}

export function getFilteredMemberList(memberList: Member[], filter: string) {
    return memberList.filter((member: Member) =>
        member.firstName.toLowerCase().includes(filter.toLowerCase())
        || member.lastName.toLowerCase().includes(filter.toLowerCase())
        || member.middleName.toLowerCase().includes(filter.toLowerCase()));
}

export function getFilteredProjectList(projectList: Project[], filter: string) {
    return projectList.filter((project: Project) =>
        project.name.toLowerCase().includes(filter.toLowerCase()));
}

export function getFilteredActivityList(activityList: Activity[], filter: string) {
    return activityList.filter((activity: Activity) =>
        activity.name.toLowerCase().includes(filter.toLowerCase()));
}

export const getEntityMember = async (entityMemberInfo: EntityParticipant) => {
    return await handleGetMember(entityMemberInfo.id).then((data) => {
        const member = data as Member;

        const entityMember: EntityParticipantView = {
            id: entityMemberInfo.id,
            fullName: member.lastName + " " + member.firstName + " " + member.middleName,
            role: entityMemberInfo.role
        }
        return entityMember;
    })
}

export const getEntityMemberList = async (entityMemberList: EntityParticipant[]) => {
    const memberList: EntityParticipantView[] = [];

    entityMemberList.forEach((entityMemberInfo) => {
        getEntityMember(entityMemberInfo).then((data)=> {
            memberList.push(data)
        });
    })
    return memberList;
}

export const getEntityProject = async (entityProjectInfo: EntityProject) => {
    return await handleGetProject(entityProjectInfo.id).then((data) => {
        const project = data as Project;

        const entityProject: EntityProjectView = {
            id: project.id,
            name: project.name
        }
        
        return entityProject;
    })
}

export const getEntityProjectList = async (entityProjectList: EntityProject[]) => {
    const projectList: EntityProjectView[] = [];

    entityProjectList.forEach((entityProjectInfo) => {
        getEntityProject(entityProjectInfo).then((data)=> {
            projectList.push(data)
        });
    })
    
    return projectList;
}
// export const getEntityMemberList = async (entityMemberList: participant[]) => {
//     const memberList = entityMemberList.map(async (entityMemberInfo) => {
//         handleGetMember(entityMemberInfo.id).then((data) => {
//             const member = data as Member;

//             const entityMember: participantView = {
//                 id: entityMemberInfo.id,
//                 fullName: member.lastName + " " + member.firstName + " " + member.middleName,
//                 description: entityMemberInfo.description
//             }
//             //memberList.push(entityMember);
//             return entityMember;
//         })
//     })

//     return memberList;
// }
/* */
// export function getEntityProjectList(entityProjectList: entityProject[]) {
//     const projectList: entityProjectView[] = [];

//     entityProjectList.forEach((entityProjectInfo) => {
//         handleGetMember(entityProjectInfo.id).then((data) => {
//             const project = data as Project;

//             const entityProject: entityProjectView = {
//                 id: project.id,
//                 name: project.name
//             }
//             projectList.push(entityProject);
//         })
//     })

//     return projectList;
// }