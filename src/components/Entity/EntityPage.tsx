import Member from "models/Member";
import Activity from "models/Activity";
import Entity from "models/Entity";
import Project from "models/Project";
import { useEffect, useState } from "react";
import MemberForm from "components/Member/MemberForm";
import ProjectForm from "components/Project/ProjectForm";
import ActivityForm from "components/Activity/ActivityForm";

import ProjectView from "components/Project/ProjectView";
import MemberView from "components/Member/MemberView";
import ActivityView from "components/Activity/ActivityView";

type status = "show" | "edit";

interface EntityPageProps {
    entity?: Entity;
    entityType: string;
    updateEntity: (entity: Entity) => void;
    removeEntity: (entityId: string) => void;
}

export default function EntityPage({
    entity,
    entityType,
    updateEntity,
    removeEntity,
}: EntityPageProps) {
    const [formStatus, setformStatus] = useState<status>("show");

    const isMember = entityType === "members";
    const isProject = entityType === "projects";
    const isActivity = entityType === "activities";

    function handlerSuccessEntity(updatedEntity: Entity) {
        if (window.confirm("Вы уверены, что хотите сохранить изменения?")) {
            updateEntity(updatedEntity);
            handlerCloseEditForm();
        }
    }

    function handlerOpenEditForm() {
        setformStatus("edit");
    }

    function handlerCloseEditForm() {
        setformStatus("show");
    }

    function handlerRemoveEntity() {
        if (entity !== undefined) {
            if (window.confirm("Вы уверены, что хотите удалить запись?")) {
                removeEntity(entity.id);
            }
        }
    }

    useEffect(() => {
        if (entity === undefined) {
            handlerOpenEditForm()
        }
    }, [])

    if (formStatus === "show" && entity !== undefined) {
        return (<>
            {isMember &&
                <MemberView
                    member={entity  as Member}
                    openEditForm={handlerOpenEditForm}
                    removeEntity={handlerRemoveEntity} />}
            {isProject &&
                <ProjectView
                    project={entity as Project}
                    openEditForm={handlerOpenEditForm}
                    removeEntity={handlerRemoveEntity} />}
            {isActivity &&
                <ActivityView
                    activity={entity as Activity}
                    openEditForm={handlerOpenEditForm}
                    removeEntity={handlerRemoveEntity} />}
        </>)
    }
    else if (formStatus === "edit") {
        return (<>
            {isMember &&
                <MemberForm
                    memberObject={entity as Member}
                    updateEntity={handlerSuccessEntity}
                    closeEditForm={handlerCloseEditForm} />}
            {isProject &&
                <ProjectForm
                    projectObject={entity as Project}
                    updateEntity={handlerSuccessEntity}
                    closeEditForm={handlerCloseEditForm} />}
            {isActivity &&
                <ActivityForm
                    activityObject={entity as Activity}
                    updateEntity={handlerSuccessEntity}
                    closeEditForm={handlerCloseEditForm} />}
        </>)
    }
    else {
        return <>Ошибка при прорисовке страницы EntityPage. Пожалуйста, перезагрузите вкладку.</>
    }
}