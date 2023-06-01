import config from "config.json";
import { PARAMETERS_ENTITY } from "models/Entity";

import { BUTTON, LABEL_CLASSNAME, VALUE_CLASSNAME } from "models/InterfaceConstants";
import Member from "models/Member";

interface MemberViewProps {
    member: Member;
    openEditForm: () => void;
    removeEntity: () => void;
}

export default function MemberView({
    member,
    openEditForm,
    removeEntity
}: MemberViewProps) {
    const isAdmin = config.accessRights === "write";
    
    const memberfullName = member.lastName + " " + member.firstName + " " + member.middleName;
    return (
        <div className="card form">
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.status}</p>
                <p className={VALUE_CLASSNAME}>{member.status}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.fullName}</p>
                <p className={VALUE_CLASSNAME}>{memberfullName}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.position}</p>
                <p className={VALUE_CLASSNAME}>{member.position}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.mobileNumber}</p>
                <p className={VALUE_CLASSNAME}>{member.mobileNumber}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.mail}</p>
                <p className={VALUE_CLASSNAME}>{member.mail}</p>
            </span>
            <span>
                <p className={LABEL_CLASSNAME}>{PARAMETERS_ENTITY.address}</p>
                <p className={VALUE_CLASSNAME}>{member.address}</p>
            </span>
            {isAdmin && <span className="card-tools">
                <button type="button" className="btn btn-success" onClick={() => openEditForm()}>{BUTTON.edit}</button>
                <button type="button" className="btn btn-dangerous" onClick={() => removeEntity()}>{BUTTON.delete}</button>
            </span>}
        </div >
    )
}