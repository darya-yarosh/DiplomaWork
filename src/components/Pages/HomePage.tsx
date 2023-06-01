import { useEffect, useState } from "react";

import { Partition, PartitionList, TEST_PARTITION_LIST } from "models/Partition";
import Entity from "models/Entity";
import Member from "models/Member";
import Project from "models/Project";
import Activity from "models/Activity";

import Header from "components/General/Header";
import Footer from "components/General/Footer";
import Modal from "components/General/Modal";
import PartitionNav from "components/Partition/PartitionNav";
import PartitionPage from "components/Partition/PartitionPage";
import EntityPage from "components/Entity/EntityPage";

import { handleAddMember, handleGetMemberList, handleRemoveMember, handleUpdateMember } from "logic/storage/firebase/MembersController";
import { handleAddProject, handleGetProjectList, handleRemoveProject, handleUpdateProject } from "logic/storage/firebase/ProjectsController";
import { handleAddActivity, handleGetActivityList, handleRemoveActivity, handleUpdateActivity } from "logic/storage/firebase/ActivitiesController";
import EMPTY_INDEX from "logic/utils/EmptyIndex";

interface HomePageProps {
    handlerLogOutClick: () => void;
}

export default function HomePage({
    handlerLogOutClick
}: HomePageProps) {
    const [isLoadedData, setIsLoadedData] = useState<boolean>(false);
    const [partitionList, setPartitionList] = useState<PartitionList>({ ...TEST_PARTITION_LIST });
    const [currentPartitionId, setCurrentPartition] = useState<string>(partitionList.members.id);
    const [currentEntity, setCurrentEntity] = useState<Entity | undefined>(undefined);
    const [isOpenedEntityPage, setIsOpenedEntityPage] = useState<boolean>(false);

    function changeCurrentPartition(nextPartition: Partition) {
        setCurrentPartition(nextPartition.id);
    }

    async function loadMemberList() {
        await handleGetMemberList().then((membersPartition) => {
            const newPartitionList = { ...partitionList };
            newPartitionList["members"].entityList = membersPartition as Member[];
            setPartitionList(newPartitionList)
        })
    }

    async function loadProjectList() {
        await handleGetProjectList().then((projectsPartition) => {
            const newPartitionList = { ...partitionList };
            newPartitionList["projects"].entityList = projectsPartition as Project[];
            setPartitionList(newPartitionList)
        });
    }

    async function loadActivityList() {
        await handleGetActivityList().then((activitiesPartition) => {
            const newPartitionList = { ...partitionList };
            newPartitionList["activities"].entityList = activitiesPartition as Activity[];
            setPartitionList(newPartitionList)
        });
    }

    async function loadPartitionList() {
        await loadMemberList();
        await loadProjectList();
        await loadActivityList().then(() => setIsLoadedData(true));
    }

    function updateEntity(newEntity: Entity) {
        const isMember = currentPartitionId === "members";
        const isProject = currentPartitionId === "projects";
        const isActivity = currentPartitionId === "activities";

        const updatedPartitionList = { ...partitionList };
        const updatedEntityIndex = updatedPartitionList[currentPartitionId].entityList.findIndex((entity) => entity.id === newEntity.id);
        if (updatedEntityIndex.toString() !== EMPTY_INDEX) {
            if (isMember) handleUpdateMember(newEntity.id, newEntity as Member);
            if (isProject) handleUpdateProject(newEntity.id, newEntity as Project);
            if (isActivity) handleUpdateActivity(newEntity.id, newEntity as Activity);
        }
        else {
            if (isMember) handleAddMember(newEntity as Member);
            if (isProject) handleAddProject(newEntity as Project);
            if (isActivity) handleAddActivity(newEntity as Activity);
        }

        setCurrentEntity(newEntity);
        loadPartitionList();
    }

    function removeEntity(entityId: string) {
        const isMember = currentPartitionId === "members";
        const isProject = currentPartitionId === "projects";
        const isActivity = currentPartitionId === "activities";
        if (isMember) {
            const hasLinks = checkMemberLinks(entityId);
            if (hasLinks) {
                window.alert("Данную запись нельзя удалить, т.к. в связанной записи данный участник является единственный.");
                return;
            }
            handleRemoveMember(entityId);
        }
        if (isProject) {
            const hasLinks = checkProjectLinks(entityId);
            // if (hasLinks) {
            //     window.alert("Данную запись нельзя удалить, т.к. в связанной записи данный проект является единственный.");
            //     return;
            // }
            handleRemoveProject(entityId);
        }
        if (isActivity) {
            handleRemoveActivity(entityId);
        }

        window.alert("Запись была успешно удалена.");

        setCurrentEntity(undefined);
        loadPartitionList();
        closeEntityPage();
    }

    function checkMemberLinks(memberId: string) {
        let linked = false;
        partitionList.activities.entityList.forEach((entity) => {
            const activity = entity as Activity;
            const findParticipant = activity.participantList.find(participant => participant.id.toString() === memberId.toString() );
            if (findParticipant !== undefined) {
                if (activity.participantList.length === 1) {
                    linked = true;
                }
                else {
                    const updatedActivity = { ...activity};
                    updatedActivity.participantList = updatedActivity.participantList.filter(participant => participant.id !== memberId);
                    handleUpdateActivity(updatedActivity.id, updatedActivity);
                }
            }
        })
        partitionList.projects.entityList.forEach((entity) => {
            const project = entity as Project;
            const findParticipant = project.participantList.find(participant => participant.id.toString() === memberId.toString());
            if (findParticipant !== undefined) {
                if (project.participantList.length === 1) {
                    linked = true;
                }
                else {
                    const updatedProject = { ...project};
                    updatedProject.participantList = updatedProject.participantList.filter(participant => participant.id !== memberId);
                    handleUpdateProject(updatedProject.id, updatedProject);
                }
            }
        })
        return linked;
    }

    function checkProjectLinks(projectId: string) {
        let linked = false;
        partitionList.activities.entityList.forEach((entity) => {
            const activity = entity as Activity;
            const findProject = activity.projectList.find(project => project.id === projectId);
            if (findProject !== undefined) {
                linked = true;
                const updatedActivity = { ...activity};
                updatedActivity.projectList = updatedActivity.projectList.filter(participant => participant.id !== projectId);
                handleUpdateActivity(updatedActivity.id, updatedActivity);
            }
        })
        return linked;
    }

    function openEntityPage(entityId: string) {
        let editingEntity = partitionList[currentPartitionId].entityList.find(entity => entity.id === entityId);

        setCurrentEntity(editingEntity);
        setIsOpenedEntityPage(true);
    }

    function closeEntityPage() {
        setIsOpenedEntityPage(false);
    }

    useEffect(() => {
        return;
    }, []);

    if (!isLoadedData) {
        loadPartitionList();

        return <div>
            Loading...
        </div>
    }

    return <>
        <Header handlerLogOutClick={handlerLogOutClick} />
        <div className="app-wrapper">
            <PartitionNav
                partitionList={partitionList}
                changeCurrentPartition={changeCurrentPartition} />
            <PartitionPage
                partition={partitionList[currentPartitionId]}
                openEntityPage={openEntityPage} />
            {isOpenedEntityPage &&
                <Modal onClose={closeEntityPage}>
                    <EntityPage
                        entity={currentEntity}
                        entityType={currentPartitionId}
                        updateEntity={updateEntity}
                        removeEntity={removeEntity}
                    />
                </Modal>
            }
        </div>
        <Footer />
    </>
}