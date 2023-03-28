/**
 * Model of employee entity.
 * 
 * @param id id of the employee.
 * @param type type of entity - employee.
 * @param lastName last name of the employee.
 * @param firstName first name of the employee.
 * @param middleName middle name of the employee.
 * @param position job post of the employee.
*/
export default interface Employee {
    id: string;
    type: string;
    lastName: string;
    firstName: string;
    middleName: string;
    position: string;
}

/** 
 * String parameters of employee.
 * 
 * @param lastName  employee last name.
 * @param firstName  employee first name.
 * @param middleName  employee middle name.
 * @param post  position of the employee.
*/
export const enum PARAMETERS_EMPLOYEE {
    lastName = "Фамилия",
    firstName = "Имя",
    middleName = "Отчество",
    post = "Должность",
}