import config from "config.json"

import Member, { PARAMETERS_MEMBER } from "models/Member";
import { BUTTON } from "models/InterfaceConstants";

interface MemberCardProps {
    member: Member;
    openMemberPage: (memberId: string) => void;
}

export default function MemberCard({
    member,
    openMemberPage,
}: MemberCardProps) {
    const memberName = member.lastName + " " + member.firstName + " " + member.middleName;
    return (
        <div className="card">
            <span>
                <p className="field-header">{PARAMETERS_MEMBER.status}</p>
                <p className="field-value">{member.status}</p>
            </span>
            <span>
                <p className="field-header">{PARAMETERS_MEMBER.fullName}</p>
                <p className="field-value">{memberName}</p>
            </span>
            <span>
                <p className="field-header">{PARAMETERS_MEMBER.position}</p>
                <p className="field-value">{member.position}</p>
            </span>
            <span className="card-tools">
                <button className="btn btn-success" onClick={() => openMemberPage(member.id)}>{BUTTON.open}</button>
            </span>
        </div>
    )
}