import { useEffect, useState } from "react";
import Validator from "logic/utils/Validator";

import Project, { EMPTY_PROJECT, ProjectStatus, isValidProject } from "models/Project";
import { BUTTON } from "models/InterfaceConstants";
import { PARAMETERS_ENTITY, EntityParticipant, EntityParticipantView } from "models/Entity";
import EMPTY_INDEX from "logic/utils/EmptyIndex";
import { handleGetMemberList } from "logic/storage/firebase/MembersController";
import Member from "models/Member";
import ParticipantTableForm from "components/Tables/ParticipantTableForm";

interface ProjectFormProps {
    projectObject: Project,
    updateEntity: (project: Project) => void;
    closeEditForm: () => void;
}


export default function ProjectForm({
    projectObject = EMPTY_PROJECT,
    updateEntity,
    closeEditForm,
}: ProjectFormProps) {
    const [project, setProject] = useState({ ...projectObject })
    const [partisipantList, setPartisipantList] = useState<EntityParticipantView[]>([]);
    
    function submitProject() {
        const validator = new Validator();
        let isCorrectParticipantList = true; 

        project.participantList.forEach(participant => {
            if (participant.id === "" && !validator.isString(participant.role)) 
                isCorrectParticipantList = false;
        });
        if (!isCorrectParticipantList) {
            window.alert("Укажите участника проекта и его роль.")
            return;
        }

        if (!isValidProject(project)) {
            return;
        }
        updateEntity(project);
    }

    function handlerUpdateStatus(newStatus: string) {
        const validator = new Validator();

        if (!validator.isValidProjectStatus(newStatus)) {
            window.alert("Некорректный статус: попробуйте снова.")
        }
        const validStatus = validator.formatStrToProjectStatus(newStatus);

        const updatedProject = { ...project };
        updatedProject.status = validStatus;
        setProject(updatedProject);
    }

    function handlerUpdateName(newName: string) {
        const updatedProject = { ...project };
        updatedProject.name = newName;
        setProject(updatedProject);
    }
    function handlerUpdateDescription(newDescription: string) {
        const updatedProject = { ...project };
        updatedProject.description = newDescription;
        setProject(updatedProject);
    }

    const statusList = [
        ProjectStatus.canceled,
        ProjectStatus.completed,
        ProjectStatus.inProgress,
        ProjectStatus.postponed,
        ProjectStatus.scheduled
    ]

    useEffect(() => {
        handleGetMemberList()
            .then((data: Member[]) => {
                const list: EntityParticipantView[] = []

                data.forEach((member: Member) => {
                    const partisipant: EntityParticipantView = {
                        id: member.id,
                        fullName: member.lastName + " " + member.firstName + " " + member.middleName,
                        role: "",
                    }
                    list.push(partisipant);
                })

                setPartisipantList(list)
            })
    }, [])
    
    function updateParticipantList(participantList: EntityParticipant[]) {
        project.participantList = participantList;
    }

    return (
        <form className="card form" onSubmit={(event) => event.preventDefault()}>
            <span>
                <label className="field-header">Статус</label>
                <select id="status-list" onChange={(event) => handlerUpdateStatus(event.target.value)}>
                    {statusList.map((status) => <option key={status} value={status} selected={project.status === status}>{status}</option>)}
                </select>

            </span>
            <span className="field-name">
                <label className="field-header">{PARAMETERS_ENTITY.name}</label>
                <input className="field-input" type="text" value={project.name} onChange={(event) => handlerUpdateName(event.target.value)} />
            </span>
            <span className="field-description">
                <label className="field-header">{PARAMETERS_ENTITY.description}</label>
                <textarea className="field-input" value={project.description} onChange={(event) => handlerUpdateDescription(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_ENTITY.participantList}</label>
                <ParticipantTableForm entityParticipantList={project.participantList} updateParticipantList={updateParticipantList} />
            </span>
            <span>
                <button className="btn btn-success" type="button" onClick={submitProject}>{BUTTON.save}</button>
                {project.id !== EMPTY_INDEX && <button className="btn btn-dangerous" type="button" onClick={closeEditForm}>{BUTTON.cancel}</button>}
            </span>
        </form>)
}