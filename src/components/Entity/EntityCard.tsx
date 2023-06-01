import Entity from "models/Entity";
import Activity from "models/Activity";
import Member from "models/Member";
import Project from "models/Project";

import ActivityCard from "components/Activity/ActivityCard";
import MemberCard from "components/Member/MemberCard";
import ProjectCard from "components/Project/ProjectCard";

interface EntityCardProps {
    entityType: string;
    entity: Entity;
    openEntityPage: (entityId: string) => void;
}

export default function EntityCard({
    entityType,
    entity,
    openEntityPage,
}: EntityCardProps) {
    const isMember = entityType === "members";
    const isProject = entityType === "projects";
    const isActivity = entityType === "activities";
    return (<>
        {isMember &&
            <MemberCard
                key={entity.id}
                member={entity as Member}
                openMemberPage={openEntityPage} />}
        {isProject &&
            <ProjectCard
                key={entity.id}
                project={entity as Project}
                openProjectPage={openEntityPage} />}
        {isActivity &&
            <ActivityCard
                key={entity.id}
                activity={entity as Activity}
                openActivityPage={openEntityPage} />}
    </>)
}