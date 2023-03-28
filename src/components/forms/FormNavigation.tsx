import { Component } from "react";

import Entity from "models/Entity";

import EntityValidator from "logic/utils/EntityValidator";

import Alert from "components/general/Alert";
import { BUTTONS } from "components/forms/Form";

/**
 * Props for entity navigation component.
 *
 * @param entity current entity.
 * @param saveHandler function of saving entity changes.
 * @param cancelHandler function of cancelation entity changes.
 * @param isAlertVisible status of alert visibility.
 */
interface FormNavigationProps {
    entity: Entity;
    saveHandler: (entity: Entity) => void;
    cancelHandler: (entity: Entity) => void;
    isAlertVisible: boolean;
}

/**
 * Component of entity navigation.
 * 
 * @return a component of entity navigation.
 */
export default class FormNavigation extends Component<FormNavigationProps> {
    render() {
        const entityValidator = new EntityValidator();
        let checksList = entityValidator.getChecksList(this.props.entity);
        const alertMessage = entityValidator.getAlertMessage(checksList);
        return (
            <section className="entityFullNav">
                {this.props.isAlertVisible && (
                    <Alert
                        alertMessage={alertMessage}
                    />)
                }
                <button type="button" onClick={() => {
                    this.props.saveHandler(this.props.entity);
                }}>
                    {BUTTONS.save}
                </button>
                <button type="button" onClick={() => {
                    this.props.cancelHandler(this.props.entity)
                }}>
                    {BUTTONS.cancel}
                </button>
            </section>
        )
    }
}