import { getEntityMember } from "logic/utils/Helper";
import { EntityParticipant, EntityParticipantView } from "models/Entity";
import { VALUE_CLASSNAME } from "models/InterfaceConstants";
import { useState, useEffect } from "react";

interface ParticipantTableProps {
    participantList: EntityParticipant[],
}
export default function ParticipantTable({
    participantList,
}: ParticipantTableProps) {
    const [isLoadedData, setIsLoadedData] = useState(false);
    const [memberList, setMemberList] = useState<EntityParticipantView[]>([]);
    const [isUpdated, setIsUpdated] = useState(false);

    function loadParticipantList() {
        const updatedMemberList = [...memberList];
        
        if (participantList === undefined) {
            return;
        }
        participantList.forEach((participant: EntityParticipant, index) => {
            getEntityMember(participant).then((data) => {
                
                updatedMemberList.push(data);
                setMemberList(updatedMemberList);

                if (index === participantList.length-1) {
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
                    <th>Участник</th>
                    <th>Роль</th>
                </tr>
                {isLoadedData && memberList.map((participant: EntityParticipantView, index) =>
                    <tr key={participant.id + index}>
                        <td>{participant.fullName}</td>
                        <td>{participant.role}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}