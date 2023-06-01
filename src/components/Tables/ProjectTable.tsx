import { getEntityProject } from "logic/utils/Helper";
import { EntityProject, EntityProjectView } from "models/Entity";
import { VALUE_CLASSNAME } from "models/InterfaceConstants";
import { useState, useEffect } from "react";

interface ProjectTableProps {
    entityProjectList: EntityProject[],
}
export default function ProjectTable({
    entityProjectList,
}: ProjectTableProps) {
    const [isLoadedData, setIsLoadedData] = useState(false);
    const [projectList, setProjectList] = useState<EntityProjectView[]>([]);
    const [isUpdated, setIsUpdated] = useState(false);

    function loadParticipantList() {
        const updatedProjectList = [...projectList];
        
        if (entityProjectList === undefined) {
            return;
        }
        entityProjectList.forEach((project: EntityProject, index) => {
            getEntityProject(project).then((data) => {
                
                updatedProjectList.push(data);
                setProjectList(updatedProjectList);

                if (index === entityProjectList.length-1) {
                    setIsUpdated(true);
                }
            })
        });
        
    }

    useEffect(() => {
        setIsLoadedData(true)
    }, [isUpdated]);

    useEffect(() => {
        return () => {
            loadParticipantList()
        }
    }, []);

    if (!isLoadedData) {
        return <div>
            Loading...
        </div>
    }
    return (
        <table className={VALUE_CLASSNAME}>
            <tbody >
                <tr>
                <th>Проект</th>
                </tr>
                {isLoadedData && projectList.map((participant: EntityProjectView, index) =>
                    <tr key={participant.id + index}>
                        <td>{participant.name}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}