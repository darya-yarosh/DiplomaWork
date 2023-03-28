import { Component } from "react";

import "components/general/Alert.css";

/**
 * Props for alert message component.
 * 
 * @param checksList  list of checks bu current entity.
 */
interface AlertProps {
    alertMessage: string;
}

/**
 * Component of alert message.
 * 
 * @param alertMessage  text of the alert message.
 * 
 * @return component of alert message.
 */
export default class Alert extends Component<AlertProps> {
    alertMessage: string;

    constructor(props: AlertProps) {
        super(props);
        this.alertMessage = props.alertMessage;;
    }

    /**
     * Rendering allert message component.
     *
     * @return the allert message component.
    */
    render() {
        return (
            <p className="alert">
                {this.alertMessage}
            </p>
        )
    }
}