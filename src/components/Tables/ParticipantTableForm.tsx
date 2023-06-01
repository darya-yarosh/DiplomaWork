import { handleGetMemberList } from "logic/storage/firebase/MembersController";
import { getEntityMember } from "logic/utils/Helper";

import { EntityParticipant, EntityParticipantView } from "models/Entity";
import { OPTION, VALUE_CLASSNAME } from "models/InterfaceConstants";
import Member, { MemberStatus } from "models/Member";
import { useState, useEffect } from "react";

interface ParticipantTableFormProps {
    entityParticipantList: EntityParticipant[],
    updateParticipantList: (participantList: EntityParticipant[]) => void,
}
export default function ParticipantTableForm({
    entityParticipantList,
    updateParticipantList,
}: ParticipantTableFormProps) {
    const [isLoadedData, setIsLoadedData] = useState(false);
    const [formParticipantList, setFormParticipantList] = useState<EntityParticipant[]>([]);

    const [viewParticipantList, setViewParticipantList] = useState<EntityParticipantView[]>([]);
    const [selectorParticipantList, setSelectorParticipantList] = useState<EntityParticipantView[]>([]);

    useEffect(() => {
        if (isLoadedData) updateParticipantList(formParticipantList)
    }, [formParticipantList]);

    function loadData() {
        loadParticipantList().then(() =>
            loadSelectorParticipantList().then(() => {
                setIsLoadedData(true);

            }));
    }
    async function loadParticipantList() {
        const updatedFormParticipantList = [...formParticipantList];
        const updatedViewParticipantList = [...viewParticipantList];

        if (entityParticipantList === undefined || entityParticipantList.length === 0) {
            const emptyViewParticipant: EntityParticipantView = {
                id: "",
                role: "",
                fullName: ""
            }
            updatedViewParticipantList.push(emptyViewParticipant);
            setViewParticipantList(updatedViewParticipantList);

            const emptyFormParticipant: EntityParticipant = {
                id: "",
                role: "",
            }
            updatedFormParticipantList.push(emptyFormParticipant)
            setFormParticipantList(updatedFormParticipantList);
        }
        else {
            entityParticipantList.forEach((participant: EntityParticipant) => {
                getEntityMember(participant).then((data) => {
                    updatedViewParticipantList.push(data);
                    setViewParticipantList(updatedViewParticipantList);

                    updatedFormParticipantList.push({
                        id: data.id,
                        role: data.role,
                    })

                    setFormParticipantList(updatedFormParticipantList);
                });
            });
        }
    }
    async function loadSelectorParticipantList() {
        handleGetMemberList().then(memberList => {
            const updatedSelectorParticipantList: EntityParticipantView[] = [];
            memberList.forEach((data) => {
                const member = data as Member;
                if (member.status !== MemberStatus.inactive) {
                    const participant: EntityParticipantView = {
                        id: data.id,
                        fullName: member.lastName + " " + member.firstName + " " + member.middleName,
                        role: ""
                    }
                    updatedSelectorParticipantList.push(participant);
                }
            });

            setSelectorParticipantList(updatedSelectorParticipantList);
        })
    }

    function createParticipantRow() {
        const updatedViewParticipantList = [...viewParticipantList];
        const emptyViewParticipant: EntityParticipantView = {
            id: "",
            role: "",
            fullName: ""
        }
        updatedViewParticipantList.push(emptyViewParticipant);
        setViewParticipantList(updatedViewParticipantList);

        const updatedFormParticipantList = [...formParticipantList];
        const emptyFormParticipant: EntityParticipant = {
            id: "",
            role: "",
        }
        updatedFormParticipantList.push(emptyFormParticipant)
        setFormParticipantList(updatedFormParticipantList);
    }
    function removeParticipantRow(removingParticipantIndex: number) {
        if (viewParticipantList.length === 1) {
            window.alert("Ошибка при удалении - требуется, чтобы в записи был хотя бы 1 участник.");
            return;
        }

        const updatedViewParticipantList = [...viewParticipantList].filter((participant, index) => index !== removingParticipantIndex);
        setViewParticipantList(updatedViewParticipantList);

        const updatedFormParticipantList = [...formParticipantList].filter((participant, index) => index !== removingParticipantIndex);
        setFormParticipantList(updatedFormParticipantList);
    }
    function onChangeFormParticipantID(updatedParticipandIndex: number, updatedParticipantID: string) {
        let updatedParticipantList = [...formParticipantList];
        updatedParticipantList[updatedParticipandIndex].id = updatedParticipantID;
        setFormParticipantList(updatedParticipantList);

        let updatedViewParticipantList = [...viewParticipantList];
        updatedViewParticipantList[updatedParticipandIndex].id = updatedParticipantID;
        setViewParticipantList(updatedViewParticipantList);
    }
    function onChangeFormParticipantDescription(updatedParticipantID: string, newDescription: string) {
        const participantIndex = formParticipantList.findIndex((participant => participant.id === updatedParticipantID));

        let updatedFormParticipantList = [...formParticipantList];
        updatedFormParticipantList[participantIndex].role = newDescription;
        setFormParticipantList(updatedFormParticipantList);

        let updatedViewParticipantList = [...viewParticipantList];
        updatedViewParticipantList[participantIndex].role = newDescription;
        setViewParticipantList(updatedViewParticipantList);
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
                        <th>Участник</th>
                        <th>Роль</th>
                    </tr>
                    {viewParticipantList.map((participant: EntityParticipantView, index) =>
                        <tr key={participant.id + index}>
                            <td>
                                <select id="member-list"
                                    value={participant.id}
                                    onChange={(event) => onChangeFormParticipantID(index, event.target.value)}
                                >
                                    <option disabled value={""}>
                                        {OPTION.default}
                                    </option>
                                    {selectorParticipantList.map((member) =>
                                        <option key={member.id} value={member.id} selected={participant.id === member.id}>{member.fullName}</option>
                                    )}
                                </select>
                            </td>
                            <td>
                                <input type="text" value={participant.role} onChange={(event) => onChangeFormParticipantDescription(participant.id, event.target.value)} />
                            </td>
                            <td>
                                <button type="button" className="btn-submit" onClick={() => removeParticipantRow(index)}>X</button>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td>
                            <button type="button" className="btn-submit" onClick={() => createParticipantRow()}>
                                Добавить нового участника
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}