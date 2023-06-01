import config from "config.json";

import { BUTTON } from "models/InterfaceConstants";
import Entity, { PARAMETERS_ENTITY } from "models/Entity";

interface ActivityViewProps {
    entity: Entity;
    openEditForm: () => void;
    removeEntity: () => void;
}

export default function ActivityView({
    entity,
    openEditForm,
    removeEntity
}: ActivityViewProps) {
    const isAdmin = config.accessRights === "write";
    
    function renderEntityView(entity: Entity) {
        const entityFields = Object.keys(entity);
        const entityValues = Object.values(entity);

        const idField = "id";
        const idFieldIndex = entityFields.findIndex(field => field === idField);

        const filteredFields = entityFields
            .filter((field, index) => index !== idFieldIndex)
            .map((field: string, index) =>
                (PARAMETERS_ENTITY as any)[field] || field
            );
        const filteredValues = entityValues.filter((value, index) => index !== idFieldIndex);

        return (
            <>
                {filteredFields.map((field, index) =>
                    <span key={field+"-"+index}>
                        <p className="field-header">{field.toString()}</p>
                        <p className="field-value">{filteredValues[index]}</p>
                    </span>
                )}
            </>
        )
    }
    
    return (
        <div className="card form">
            {renderEntityView(entity)}
            {isAdmin && <span className="card-tools">
                <button type="button" className="btn btn-success" onClick={() => openEditForm()}>{BUTTON.edit}</button>
                <button type="button" className="btn btn-dangerous" onClick={() => removeEntity()}>{BUTTON.delete}</button>
            </span>}
        </div >
    )
}