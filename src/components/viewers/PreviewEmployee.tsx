import { Component } from "react";

import Employee, { PARAMETERS_EMPLOYEE } from "models/Employee";

import RenderConverter from "logic/utils/RenderConverter";

/**
 * Props for renderer of preview employee entity.
 * 
 * @param employee  employee entity.
 */
interface PreviewEmployeeProps {
    employee: Employee;
}

/**
 * Renderer of preview entity information about employee.
 *
 * @return component with rendered preview entity information about employee.
*/
export default class PreviewEmployee extends Component<PreviewEmployeeProps> {
    /**
     * Rendering preview information about employee.
     * 
     * @return a rendered preview information about employee entity.
    */
    render() {
        let employee = this.props.employee;

        const converterForRender = new RenderConverter();
        let employeeLastName = converterForRender.convert(employee.lastName);
        let employeeFirstName = converterForRender.convert(employee.firstName);
        let employeeMiddleName = converterForRender.convert(employee.middleName);
        let employeePost = converterForRender.convert(employee.position);

        return (
            <div className="entityPreview">
                <section className="entityPreviewInfo employeePreview">
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_EMPLOYEE.lastName}</p>
                        <p className="column-info">{employeeLastName}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_EMPLOYEE.firstName}</p>
                        <p className="column-info">{employeeFirstName}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_EMPLOYEE.middleName}</p>
                        <p className="column-info">{employeeMiddleName}</p>
                    </section>
                    <section className="column">
                        <p className="column-parameter">{PARAMETERS_EMPLOYEE.post}</p>
                        <p className="column-info">{employeePost}</p>
                    </section>
                </section>
            </div>
        )
    }
}