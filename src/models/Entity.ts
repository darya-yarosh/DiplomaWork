import EMPTY_INDEX from "logic/utils/EmptyIndex";
import Employee from "models/Employee";
import Project from "models/Project";
import Task from "models/Task";

/**
 * A common type for all entity models.
 */
type Entity = Employee | Task | Project;

export default Entity;

/**
 * String values of entity type names.
 * 
 * @param employee employee-type of entity.
 * @param task task-type of entity.
 * @param project project-type of entity.
 */
export const enum ENTITY_TYPES {
    employee = "Employee",
    task = "Task",
    project = "Project"
}

/**
 * Templates of empty entities.
 * 
 * @param employee empty employee entity.
 * @param task empty task entity.
 * @param project empty project entity.
*/
export const DEFAULT_EMPTY_ENTITY = {
    employee: {
        id: EMPTY_INDEX,
        type: ENTITY_TYPES.employee,
        lastName: "",
        firstName: "",
        middleName: "",
        position: ""
    } as Employee,
    task: {
        id: EMPTY_INDEX,
        type: ENTITY_TYPES.task,
        status: "",
        name: "",
        projectId: EMPTY_INDEX,
        executionTime: "",
        employeeId: EMPTY_INDEX,
        startDate: "",
        finishDate: ""
    } as Task,
    project: {
        id: EMPTY_INDEX,
        type: ENTITY_TYPES.project,
        name: "",
        description: ""
    } as Project
}