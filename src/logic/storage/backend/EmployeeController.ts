import RequestHandler from "logic/storage/backend/RequestHandler";

import { ENTITY_TYPES } from "models/Entity";
import Employee from "models/Employee";

/**
 * Controller of employee section from backend.
 */
export default class EmployeeController {
    employeeLink: string;

    constructor() {
        this.employeeLink = `http://localhost:8080/api/employees/`;
    }

    /**
     * Send request to create new employee.
     * 
     * @param newEmployee data of new employee.
     * 
     * @returns result of request. true if employee is created. false if employee is not created.
     */
    async create(newEmployee: any) {
        let requestHandler = new RequestHandler();

        delete newEmployee.type;
        newEmployee.middleName = (newEmployee.middleName === "") ? null : newEmployee.middleName;

        let src = this.employeeLink;
        const employee = await requestHandler.createData(src, newEmployee);
        return employee;
    }

    /**
     * Send request to update employee.
     * 
     * @param id id of updating employee.
     * @param updatedEmployee new data of employee.
     * 
     * @returns result of request. true if employee is updated. false if employee is not updated.
     */
    async update(id: string, updatedEmployee: any) {
        let requestHandler = new RequestHandler();

        delete updatedEmployee.type;
        updatedEmployee.middleName = (updatedEmployee.middleName === "") ? null : updatedEmployee.middleName;

        let src = this.employeeLink + `${id}`;
        const employee = await requestHandler.updateData(src, updatedEmployee);
        return employee;
    }

    /**
     * Send request to remove employee.
     * 
     * @param id id of removing employee.
     * 
     * @returns result of request. true if employee is removed. false if employee is not removed.
     */
    async delete(id: string) {
        let requestHandler = new RequestHandler();

        let src = this.employeeLink + `${id}`;
        const employee = await requestHandler.deleteData(src);
        return employee;
    }

    /**
     * Send request to get employee list.
     * 
     * @returns employee entity list.
     */
    async getAll() {
        let requestHandler = new RequestHandler();

        let srcMain = this.employeeLink;
        const employeeListDefault = await requestHandler.getData(srcMain);

        let size = employeeListDefault.totalElements;;
        let srcContent = this.employeeLink + `?size=${size}`;
        const employeeListFull = await requestHandler.getData(srcContent);

        employeeListFull.content.forEach((employee: Employee) => {
            employee.type = ENTITY_TYPES.employee;
            employee.middleName = (employee.middleName === null) ? "" : employee.middleName;
        })
        return employeeListFull.content;
    }

    /**
     * Send request to get employee data.
     * 
     * @param id id of getting employee.
     * 
     * @returns employee data.
     */
    async get(id: string) {
        let requestHandler = new RequestHandler();

        let src = this.employeeLink + `${id}`;
        const employee = await requestHandler.getData(src);

        employee.type = ENTITY_TYPES.employee;
        employee.middleName = (employee.middleName === null) ? "" : employee.middleName;
        return employee;
    }
}