import { handleGetProjectList } from "logic/storage/firebase/ProjectsController";
import { getEntityProject } from "logic/utils/Helper";
import { EntityProject, EntityProjectView, } from "models/Entity";
import { OPTION, VALUE_CLASSNAME } from "models/InterfaceConstants";
import Project, { ProjectStatus } from "models/Project";
import { useState, useEffect } from "react";

interface ProjectTableFormProps {
    entityProjectList: EntityProject[],
    updateProjectList: (projectList: EntityProject[]) => void,
}
export default function ProjectTableForm({
    entityProjectList,
    updateProjectList,
}: ProjectTableFormProps) {
    const [isLoadedData, setIsLoadedData] = useState(false);
    const [formProjectList, setFormProjectList] = useState<EntityProject[]>([]);

    const [viewProjectList, setViewProjectList] = useState<EntityProjectView[]>([]);
    const [selectorProjectList, setSelectorProjectList] = useState<EntityProjectView[]>([]);

    useEffect(() => {
        if (isLoadedData) updateProjectList(formProjectList)
    }, [formProjectList]);

    function loadData() {
        loadParticipantList().then(() =>
            loadSelectorParticipantList().then(() => {
                setIsLoadedData(true);

            }));
    }
    async function loadParticipantList() {
        const updatedFormParticipantList = [...formProjectList];
        const updatedViewParticipantList = [...viewProjectList];

        if (entityProjectList === undefined || entityProjectList.length === 0) {
            const emptyViewParticipant: EntityProjectView = {
                id: "",
                name: ""
            }
            updatedViewParticipantList.push(emptyViewParticipant);
            setViewProjectList(updatedViewParticipantList);

            const emptyFormParticipant: EntityProject = {
                id: "",
            }
            updatedFormParticipantList.push(emptyFormParticipant)
            setFormProjectList(updatedFormParticipantList);
        }
        else {
            entityProjectList.forEach((entityProjectInfo: EntityProject) => {
                getEntityProject(entityProjectInfo).then((data) => {
                    updatedViewParticipantList.push(data);
                    setViewProjectList(updatedViewParticipantList);

                    updatedFormParticipantList.push({
                        id: data.id,
                    })
                    setFormProjectList(updatedFormParticipantList);
                });
            });
        }
    }
    async function loadSelectorParticipantList() {
        handleGetProjectList().then(projectList => {
            const updatedSelectorParticipantList: EntityProjectView[] = [];
            projectList.forEach((data) => {
                const project = data as Project;

                if (project.status !== ProjectStatus.canceled && project.status !== ProjectStatus.completed) {
                    const participant: EntityProjectView = {
                        id: data.id,
                        name: project.name,
                    }
                    updatedSelectorParticipantList.push(participant);
                }
            });

            setSelectorProjectList(updatedSelectorParticipantList);
        })
    }

    function createParticipantRow() {
        const updatedViewParticipantList = [...viewProjectList];
        const emptyViewParticipant: EntityProjectView = {
            id: "",
            name: ""
        }
        updatedViewParticipantList.push(emptyViewParticipant);
        setViewProjectList(updatedViewParticipantList);

        const updatedFormParticipantList = [...formProjectList];
        const emptyFormParticipant: EntityProject = {
            id: "",
        }
        updatedFormParticipantList.push(emptyFormParticipant)
        setFormProjectList(updatedFormParticipantList);
    }
    function removeParticipantRow(removingParticipantIndex: number) {
        if (viewProjectList.length === 1) {
            window.alert("Ошибка при удалении - требуется, чтобы в записи был хотя бы 1 участник.");
            return;
        }

        const updatedViewParticipantList = [...viewProjectList].filter((participant, index) => index !== removingParticipantIndex);
        setViewProjectList(updatedViewParticipantList);

        const updatedFormParticipantList = [...formProjectList].filter((participant, index) => index !== removingParticipantIndex);
        setFormProjectList(updatedFormParticipantList);
    }
    function onChangeFormParticipantID(updatedParticipandIndex: number, updatedParticipantID: string) {
        let updatedParticipantList = [...formProjectList];
        updatedParticipantList[updatedParticipandIndex].id = updatedParticipantID;
        setFormProjectList(updatedParticipantList);

        let updatedViewParticipantList = [...viewProjectList];
        updatedViewParticipantList[updatedParticipandIndex].id = updatedParticipantID;
        setViewProjectList(updatedViewParticipantList);
    }

    useEffect(() => {
        return () => {
            loadData();
        }
    }, []);

    if (!isLoadedData) {
        return <div>
            Loading...
        </div>
    } else {
        return (
            <table className={VALUE_CLASSNAME}>
                <tbody >
                    <tr>
                        <th>Проект</th>

                    </tr>
                    {viewProjectList.map((entityProject: EntityProjectView, index) =>
                        <tr key={entityProject.id + index}>
                            <td>
                                <select id="project-list"
                                    value={entityProject.id}
                                    onChange={(event) => onChangeFormParticipantID(index, event.target.value)}
                                >
                                    <option disabled value={""}>
                                        {OPTION.default}
                                    </option>
                                    {selectorProjectList.map((project) =>
                                        <option key={project.id} value={project.id} selected={entityProject.id === project.id}>{project.name}</option>
                                    )}
                                </select>
                            </td>
                            <td>
                                <button type="button" className="btn-submit" onClick={() => removeParticipantRow(index)}>X</button>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td>
                            <button type="button" className="btn-submit" onClick={() => createParticipantRow()}>
                                Добавить новый проект
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}