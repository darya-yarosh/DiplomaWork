import { Component } from "react";

import { PartitionListContext } from "logic/Context";

import Entity from "models/Entity";
import Employee, { PARAMETERS_EMPLOYEE } from "models/Employee";
import { PartitionList } from "models/Partition";

import EntityHandler from "logic/utils/EntityHandler";
import EntityValidator from "logic/utils/EntityValidator";

import FormNavigation from "components/forms/FormNavigation";

/**
 * Patterns of employee data fields.
 * 
 * @param lastNameLength length of the "Last name" field.
 * @param firstNameLength length of the "First length
 * @param middleNameLength length of the "Middle name" field.
 * @param postLength length of the "Post" field.
 * @param lastNamePlaceholder the placeholder for the employee last name.
 * @param firstNamePlaceholder the placeholder for the employee first name.
 * @param middleNamePlaceholder the placeholder for the employee middle name.
 * @param postPlaceholder the placeholder for the employee post.
 */
const EmployeePatterns = {
    lastNameLength: 50,
    firstNameLength: 50,
    middleNameLength: 50,
    postLength: 75,
    lastNamePlaceholder: "Иванов",
    firstNamePlaceholder: "Иван",
    middleNamePlaceholder: "Иванович",
    postPlaceholder: "Сотрудник 1-разряда.",
}

/**
 * Props for renderer of employee form.
 * 
 * @param employee current entity.
 * @param saveEmployee function of saving employee entity.
 * @param cancelEmployee function of cancelinf editing employee entity.
*/
interface FormEmployeeProps {
    employee: Employee;
    saveEmployee: (entity: Entity) => void;
    cancelEmployee: (entity: Entity) => void;
}

/**
 * State by employee form.
 * 
 * @param employee employee on form.
 */
interface FormEmployeeState {
    employee: Employee;
}

/**
 * Renderer the form with full entity information about employee.
 *
 * @param isAlertVisible state of alert visibility.
 * @param state state of current employee form.
 * 
 * @return form with full rendered entity information.
*/
export default class FormEmployee extends Component<FormEmployeeProps> {
    static contextType = PartitionListContext;
    isAlertVisible = false;

    state: FormEmployeeState;

    constructor(props: FormEmployeeProps) {
        super(props);
        this.state = {
            employee: this.props.employee,
        }
    }

    /**
     * Rendering entity information about employee.
     * 
     * @return a rendered information about employee entity.
    */
    render() {
        const handler = new EntityHandler(() => {
            this.setAlertVisibility(false);
        });

        let partitionList = this.context as PartitionList;
        partitionList.employees.currentEntity = this.state.employee;
        return (
            <form className="entityInfo">
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_EMPLOYEE.lastName} *
                    </label>
                    <article className="entityInfoValueText">
                        <input
                            type="text"
                            placeholder={EmployeePatterns.lastNamePlaceholder}
                            value={this.state.employee.lastName}
                            maxLength={EmployeePatterns.lastNameLength}
                            onChange={(event) => {
                                let updatedEmployee = { ...this.state.employee };

                                let newValue = event.target.value;
                                let oldValue = updatedEmployee.lastName;
                                updatedEmployee.lastName = handler.handleTextWithValidation(newValue, oldValue);

                                this.setState({ employee: updatedEmployee });
                            }} />
                    </article>
                </section>
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_EMPLOYEE.firstName} *
                    </label>
                    <article className="entityInfoValueText">
                        <input
                            type="text"
                            placeholder={EmployeePatterns.firstNamePlaceholder}
                            value={this.state.employee.firstName}
                            maxLength={EmployeePatterns.firstNameLength}
                            onChange={(event) => {
                                let updatedEmployee = { ...this.state.employee };

                                let newValue = event.target.value;
                                let oldValue = updatedEmployee.firstName;
                                updatedEmployee.firstName = handler.handleTextWithValidation(newValue, oldValue);

                                this.setState({ employee: updatedEmployee });
                            }} />
                    </article>
                </section>
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_EMPLOYEE.middleName}
                    </label>
                    <article className="entityInfoValueText">
                        <input
                            type="text"
                            placeholder={EmployeePatterns.middleNamePlaceholder}
                            value={this.state.employee.middleName}
                            maxLength={EmployeePatterns.middleNameLength}
                            onChange={(event) => {
                                let updatedEmployee = { ...this.state.employee };

                                let newValue = event.target.value;
                                let oldValue = updatedEmployee.middleName;
                                updatedEmployee.middleName = handler.handleTextWithValidation(newValue, oldValue);

                                this.setState({ employee: updatedEmployee });
                            }} />
                    </article>
                </section>
                <section className="entityInfoLine">
                    <label className="entityInfoParameter">
                        {PARAMETERS_EMPLOYEE.post} *
                    </label>
                    <article className="entityInfoValueText">
                        <input
                            type="text"
                            placeholder={EmployeePatterns.postPlaceholder}
                            value={this.state.employee.position}
                            maxLength={EmployeePatterns.postLength}
                            onChange={(event) => {
                                let updatedEmployee = { ...this.state.employee };

                                let newValue = event.target.value;
                                updatedEmployee.position = handler.handleText(newValue);

                                this.setState({ employee: updatedEmployee });
                            }} />
                    </article>
                </section>
                <FormNavigation
                    entity={this.state.employee}
                    saveHandler={this.handlerSave.bind(this)}
                    cancelHandler={this.props.cancelEmployee.bind(this)}
                    isAlertVisible={this.isAlertVisible}
                />
            </form>
        )
    }

    /**
     * Handler of employee entity saving. 
     * Save if entity is valid. Show alert if entity is invalid.
     */
    handlerSave() {
        let entityValidator = new EntityValidator();
        if (entityValidator.isValid(this.state.employee)) {
            this.props.saveEmployee(this.state.employee)
        }
        else {
            this.setAlertVisibility(true);
        }
        this.setState({})
    }

    /**
    * Setter of boolean value of alert message visibility.
    * 
    * @param isVisibility  new alert message visibility status.
    */
    setAlertVisibility(isVisibility: boolean) {
        this.isAlertVisible = isVisibility;
    }
}