import { useState } from "react";
import Validator from 'logic/utils/Validator';

import Member, { EMPTY_MEMBER, MemberPosition, MemberStatus, PARAMETERS_MEMBER, isValidMember } from "models/Member";
import { BUTTON } from "models/InterfaceConstants";
import EMPTY_INDEX from "logic/utils/EmptyIndex";
import { Placeholders } from "logic/utils/Validator";

interface MemberFormProps {
    memberObject?: Member
    updateEntity: (member: Member) => void;
    closeEditForm: () => void;
}

const validator = new Validator();

export default function MemberForm({
    memberObject,
    updateEntity,
    closeEditForm,
}: MemberFormProps) {
    const [member, setMember] = useState({ ...memberObject === undefined ? EMPTY_MEMBER : memberObject })

    function submitMember() {
        if (!isValidMember(member)) {
            return;
        }
        
        updateEntity(member);
    }

    function handlerUpdateStatus(newStatus: string) {
        if (!validator.isValidMemberStatus(newStatus)) {
            window.alert("Некорректный статус: попробуйте снова.")
        }
        const validStatus = validator.formatStrToMemberStatus(newStatus);

        const updatedMember = { ...member };
        updatedMember.status = validStatus;
        setMember(updatedMember);
    }
    function handlerUpdateFirstName(newValue: string) {
        const updatedMember = { ...member };
        updatedMember.firstName = newValue;
        setMember(updatedMember);
    }
    function handlerUpdateLastName(newValue: string) {
        const updatedMember = { ...member };
        updatedMember.lastName = newValue;
        setMember(updatedMember);
    }
    function handlerUpdateMiddleName(newValue: string) {
        const updatedMember = { ...member };
        updatedMember.middleName = newValue;
        setMember(updatedMember);
    }
    function handlerUpdatePosition(newPosition: string) {
        if (!validator.isValidPosition(newPosition)) {
            window.alert("Некорректная должность: попробуйте снова.")
        }
        const validPosition = validator.formatStrToPosition(newPosition);

        const updatedMember = { ...member };
        updatedMember.position = validPosition;
        setMember(updatedMember);
    }
    function handlerUpdateAddress(newValue: string) {
        const updatedMember = { ...member };
        updatedMember.address = newValue;
        setMember(updatedMember);
    }
    function handlerUpdateMail(newValue: string) {
        const updatedMember = { ...member };
        updatedMember.mail = newValue;
        setMember(updatedMember);
    }
    function handlerUpdateMobileNumber(newValue: string) {
        const updatedMember = { ...member };
        updatedMember.mobileNumber = newValue;
        setMember(updatedMember);
    }
    
    const statusList = [
        MemberStatus.active,
        MemberStatus.inactive
    ]

    const positionList = [
        MemberPosition.student,
        MemberPosition.teacher,
        MemberPosition.other
    ]
    return (
        <form className="card form" onSubmit={(event) => event.preventDefault()}>
            <span>
                <label className="field-header">{PARAMETERS_MEMBER.status}</label>

                <select className="field-input" id="status-list" defaultValue={MemberStatus.inactive} onChange={(event) => handlerUpdateStatus(event.target.value)}>
                    {statusList.map((status) => <option key={status} value={status} selected={member.status === status}>{status}</option>)}
                </select>
            </span>
            <span>
                <label className="field-header">{PARAMETERS_MEMBER.lastName}</label>
                <input className="field-input"
                    value={member.lastName}
                    onChange={(event) => handlerUpdateLastName(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_MEMBER.firstName}</label>
                <input className="field-input" type="text"
                    value={member.firstName}
                    onChange={(event) => handlerUpdateFirstName(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_MEMBER.middleName}</label>
                <input className="field-input"
                    value={member.middleName}
                    onChange={(event) => handlerUpdateMiddleName(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_MEMBER.position}</label>
                <select className="field-input" id="position-list" defaultValue={MemberPosition.other} onChange={(event) => handlerUpdatePosition(event.target.value)}>
                    {positionList.map((position) => <option key={position} value={position} selected={member.position === position}>{position}</option>)}
                </select>
            </span>
            <span>
                <label className="field-header">{PARAMETERS_MEMBER.mobileNumber}</label>
                <input className="field-input" type="tel" value={member.mobileNumber} placeholder={Placeholders.mobileNumber}
                    onChange={(event) => handlerUpdateMobileNumber(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_MEMBER.mail}</label>
                <input className="field-input" type="email" value={member.mail} placeholder={Placeholders.mail}
                    onChange={(event) => handlerUpdateMail(event.target.value)} />
            </span>
            <span>
                <label className="field-header">{PARAMETERS_MEMBER.address}</label>
                <input className="field-input" value={member.address}
                    onChange={(event) => handlerUpdateAddress(event.target.value)} />
            </span>
            <span>
                <button className="btn btn-success" type="button" onClick={()=>submitMember()}>{BUTTON.save}</button>
                {member.id !== EMPTY_INDEX && <button className="btn btn-dangerous" type="button" onClick={closeEditForm}>{BUTTON.cancel}</button>}
            </span>
        </form>
    )
}