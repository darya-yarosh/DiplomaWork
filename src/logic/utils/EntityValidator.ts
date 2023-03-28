import Entity, { DEFAULT_EMPTY_ENTITY, ENTITY_TYPES } from "models/Entity";
import Employee from "models/Employee";
import Project from "models/Project";
import Task from "models/Task";

import Validator from "logic/utils/Validator";
import EMPTY_INDEX from "logic/utils/EmptyIndex";

/**
 * String values of alert messages for input data.
 * 
 * @param invalidData alert message about invalid data.
 * @param emptyRequiredData alert message that the required data is empty.
 */
const enum ALERT_MESSAGES {
    invalidData = "Неверно введены данные: ",
    emptyRequiredData = "Обязательные поля не заполнены: "
}

/**
 * Types of employee input data checks list.
 * 
 * @param isEmptyLastName checks of last name is empty.
 * @param isEmptyFirstName checks of first name is empty.
 * @param isEmptyPost checks of post is empty.
 */
export interface employeeChecks {
    isEmptyLastName: boolean,
    isEmptyFirstName: boolean,
    isEmptyPost: boolean,
}

/**
 * Types of task input data checks list.
 * 
 * @param isEmptyStatus checks of status is empty.
 * @param isEmptyName checks of name is empty.
 * @param isNotSelectedProject  checks of project is not selected.
 * @param isZeroWork checks of work time has zero hours.
 * @param isInvalidStartDate checks of start date is invalid.
 * @param isInvalidEndDate checks of end date is invalid.
 * @param isStartDateLargerThenEndDate checks of start date is larger then end date.
 */
export interface taskChecks {
    isEmptyStatus: boolean,
    isEmptyName: boolean,
    isNotSelectedProject: boolean,
    isZeroWork: boolean,
    isInvalidStartDate: boolean,
    isInvalidEndDate: boolean,
    isStartDateLargerThenEndDate: boolean
}

/**
 * Types of project input data checks list.
 * 
 * @param isEmptyName checks of name is empty.
 */
export interface projectChecks {
    isEmptyName: boolean,
}

/**
 * A common type for all entity checks.
 */
export type entityChecks = employeeChecks | taskChecks | projectChecks;

/**
 * Types of input data checks list.
 * 
 * @param employeeChecks checks of employee valid status.
 * @param taskChecks checks of task valid status.
 * @param projectChecks checks of project valid status.
 */
export interface checksListTypes {
    employeeChecks: employeeChecks,
    taskChecks: taskChecks,
    projectChecks: projectChecks
}

/**
 * Info of entity validation status.
 * 
 * @param isEmployeeValid checks of employee valid status.
 * @param isTaskValid checks of task valid status.
 * @param isProjectValid checks of project valid status.
 */
export interface entityValidationInfo {
    isEmployeeValid: boolean,
    isTaskValid: boolean,
    isProjectValid: boolean,
}

/**
 * Validator of entity data of partitions.
 */
export default class EntityValidator {
    /**
     * Getting information about the results of checking entity data.
     *
     * @param entity selected entity for checking.
     * 
     * @return result of checking entity data. True if entity info is valid. False is entity info is invalid.
    */
    isValid(entity: Entity) {
        let result = false;

        if (entity.type === ENTITY_TYPES.employee) {
            let employeeChecks = this.getEmployeeChecksList(entity as Employee);
            result = this.getChecksListSectionResult(Object.values(employeeChecks));
        }
        else if (entity.type === ENTITY_TYPES.task) {
            let taskChecks = this.getTaskChecksList(entity as Task);
            result = this.getChecksListSectionResult(Object.values(taskChecks));
        }
        else if (entity.type === ENTITY_TYPES.project) {
            let projectChecks = this.getProjectChecksList(entity as Project);
            result = this.getChecksListSectionResult(Object.values(projectChecks));
        }
        else {
            // This case will not be worked out, because EntityType is always specified.
        }
        return result;
    }

    /**
     * Getting checks list of input entity info.
     *
     * @param entity selected entity for checking.
     * 
     * @return list of validations for the current entity.
    */
    getChecksList(entity: Entity) {
        let checksList: checksListTypes = {
            employeeChecks: {
                isEmptyLastName: false,
                isEmptyFirstName: false,
                isEmptyPost: false,
            },
            taskChecks: {
                isEmptyStatus: false,
                isEmptyName: false,
                isNotSelectedProject: false,
                isZeroWork: false,
                isInvalidStartDate: false,
                isInvalidEndDate: false,
                isStartDateLargerThenEndDate: false,
            },
            projectChecks: {
                isEmptyName: false,
            }
        }

        if (entity.type === ENTITY_TYPES.employee) {
            checksList.employeeChecks = this.getEmployeeChecksList(entity as Employee);
        }
        else if (entity.type === ENTITY_TYPES.task) {
            checksList.taskChecks = this.getTaskChecksList(entity as Task);
        }
        else if (entity.type === ENTITY_TYPES.project) {
            checksList.projectChecks = this.getProjectChecksList(entity as Project);
        }
        else {
            // This case will not be worked out, because EntityType is always specified.
        }
        return checksList;
    }

    /**
     * Getting the list of checks of current employee.
     * 
     * @param employee selected employee to check.
     * 
     * @return list of checks result of current employee.
     */
    getEmployeeChecksList(employee: Employee) {
        const validator = new Validator();

        const isEmptyLastName = validator.isEmpty(employee.lastName);
        const isEmptyFirstName = validator.isEmpty(employee.firstName);
        const isEmptyPost = validator.isEmpty(employee.position);

        let employeeChecksList: employeeChecks = {
            isEmptyLastName,
            isEmptyFirstName,
            isEmptyPost,
        }
        return employeeChecksList;
    }
    /**
     * Getting the list of checks of current task.
     * 
     * @param task selected task on check.
     * 
     * @return list of checks result of current task.
     */
    getTaskChecksList(task: Task) {
        const validator = new Validator();

        const isEmptyName = validator.isEmpty(task.name);
        const isEmptyStatus = validator.isEmpty(task.status);
        const isNotSelectedProject = !this.isProjectSelected(task.projectId);

        let isZeroWork = false;
        let isInvalidStartDate = false;
        let isInvalidEndDate = false;
        let isStartDateLargerThenEndDate = false;

        if (!validator.isEmpty(task.executionTime)) {
            isZeroWork = Number(task.executionTime) === 0;
        }
        if (!validator.isEmpty(task.startDate)) {
            isInvalidStartDate = !validator.isValidDate(task.startDate);
        }
        if (!validator.isEmpty(task.finishDate)) {
            isInvalidEndDate = !validator.isValidDate(task.finishDate);
        }
        if (!validator.isEmpty(task.startDate) && !validator.isEmpty(task.finishDate)) {
            isStartDateLargerThenEndDate = (task.startDate > task.finishDate);
        }

        let taskChecksList: taskChecks = {
            isEmptyStatus,
            isEmptyName,
            isNotSelectedProject,
            isZeroWork,
            isInvalidStartDate,
            isInvalidEndDate,
            isStartDateLargerThenEndDate,
        }
        return taskChecksList;
    }

    /**
     * Getting the list of checks of current project.
     * 
     * @param project selected project on check.
     * 
     * @return list of checks result of current project.
     */
    getProjectChecksList(project: Project) {
        const validator = new Validator();
        const isEmptyName = validator.isEmpty(project.name);

        let projectChecksList: projectChecks = {
            isEmptyName,
        }
        return projectChecksList;
    }

    /**
     * Getting result from section of checks list.
     * 
     * @param section section of checks list.
     * 
     * @return result from section of checks list.
     */
    getChecksListSectionResult(section: boolean[]) {
        let isValidValue = true;

        let errorFound = section.find((check) => check === true);
        if (errorFound) {
            isValidValue = false;
        }
        return isValidValue;
    }

    /**
     * Getter of alert message after entity checking.
     *
     * @param checksList list of checks by current entity.
     *
     * @return alert message after entity checking.
     */
    getAlertMessage(checksList: checksListTypes) {
        let alertMessage = "";

        const entityValidator = new EntityValidator();
        const isEmployeeValid = entityValidator.getChecksListSectionResult(Object.values(checksList.employeeChecks));
        const isTaskValid = entityValidator.getChecksListSectionResult(Object.values(checksList.taskChecks));
        const isProjectValid = entityValidator.getChecksListSectionResult(Object.values(checksList.projectChecks));
        if (isEmployeeValid === false) {
            alertMessage = this.getAlertMessageOfCheckedEmployee(checksList.employeeChecks);
        }
        else if (isTaskValid === false) {
            alertMessage = this.getAlertMessageOfCheckedTask(checksList.taskChecks);
        }
        else if (isProjectValid === false) {
            alertMessage = this.getAlertMessageOfCheckedProject(checksList.projectChecks);
        }
        else {
            // This case will not be worked out, because entityValidationInfo type is always specified.
        }
        return alertMessage;
    }

    /**
     * Getter of alert message after employee entity checking.
     * 
     * @param employeeCheckList list of checks by employee entity.
     * 
     * @return alert message after employee entity checking.
     */
    getAlertMessageOfCheckedEmployee(employeeCheckList: employeeChecks) {
        let currentAlertMessage = "";
        const isEmptyFields = employeeCheckList.isEmptyLastName
            || employeeCheckList.isEmptyFirstName
            || employeeCheckList.isEmptyPost;
        if (isEmptyFields) {
            currentAlertMessage = ALERT_MESSAGES.emptyRequiredData;
            if (employeeCheckList.isEmptyLastName) {
                currentAlertMessage += "Фамилия; "
            }
            if (employeeCheckList.isEmptyFirstName) {
                currentAlertMessage += "Имя; "
            }
            if (employeeCheckList.isEmptyPost) {
                currentAlertMessage += "Должность; "
            }
        }
        return currentAlertMessage;
    }

    /**
     * Getter of alert message after task entity checking.
     * 
     * @param taskCheckList list of checks by task entity.
     * 
     * @return alert message after task entity checking.
     */
    getAlertMessageOfCheckedTask(taskCheckList: taskChecks) {
        let currentAlertMessage = "";
        const isInvalidDataInFields = taskCheckList.isZeroWork
            || taskCheckList.isStartDateLargerThenEndDate
            || taskCheckList.isInvalidStartDate
            || taskCheckList.isInvalidEndDate;
        if (isInvalidDataInFields) {
            currentAlertMessage = ALERT_MESSAGES.invalidData;
            if (taskCheckList.isZeroWork) {
                currentAlertMessage += "Работа должна быть больше 0; "
            }
            if (taskCheckList.isStartDateLargerThenEndDate) {
                currentAlertMessage += "Дата начала больше даты окончания; "
            }
            if (taskCheckList.isInvalidStartDate) {
                currentAlertMessage += "Некорректная дата начала; "
            }
            if (taskCheckList.isInvalidEndDate) {
                currentAlertMessage += "Некорректная дата окончания; "
            }
        }
        const isEmptyFields = taskCheckList.isEmptyName
            || taskCheckList.isNotSelectedProject
            || taskCheckList.isEmptyStatus;
        if (isEmptyFields) {
            currentAlertMessage = ALERT_MESSAGES.emptyRequiredData;
            if (taskCheckList.isEmptyName) {
                currentAlertMessage += "Наименование; "
            }
            if (taskCheckList.isNotSelectedProject) {
                currentAlertMessage += "Наименование проекта; "
            }
            if (taskCheckList.isEmptyStatus) {
                currentAlertMessage += "Статус; "
            }
        }
        return currentAlertMessage;
    }

    /**
     * Getter of alert message after employee entity checking.
     * 
     * @param projectCheckList list of checks by project entity.
     * 
     * @return alert message after project entity checking.
     */
    getAlertMessageOfCheckedProject(projectCheckList: projectChecks) {
        let currentAlertMessage = "";
        const isEmptyFields = projectCheckList.isEmptyName;
        if (isEmptyFields) {
            currentAlertMessage = ALERT_MESSAGES.emptyRequiredData;
            if (projectCheckList.isEmptyName) {
                currentAlertMessage += "Наименование; "
            }
        }
        return currentAlertMessage;
    }

    /**
     * Checking is new task is task of project.
     * 
     * @param task selected task.
     * 
     * @return true if task is new task of project. false if new task is not of project.
     */
    isNewTaskOfProject(task: Task) {
        let isNewTaskOfProject = false;

        const isTaskProjectIsNew = task.projectId === EMPTY_INDEX;
        if (!isTaskProjectIsNew) {
            const taskWithProject = DEFAULT_EMPTY_ENTITY.task;
            taskWithProject.projectId = task.projectId;

            const isRequiredTask = JSON.stringify(task) === JSON.stringify(taskWithProject);
            if (isRequiredTask) {
                isNewTaskOfProject = true;
            }
        }
        return isNewTaskOfProject;
    }

    /**
     * Checking project is selected for task.
     *
     * @param projectId id of task project.
     * 
     * @return true if task project is selected. false if project of task is not selected.
    */
    isProjectSelected(projectId: string) {
        let isProjectSelected = false;

        const isProjectIsNew = projectId === EMPTY_INDEX;
        if (!isProjectIsNew) {
            isProjectSelected = true;
        }
        return isProjectSelected;
    }

    /**
     * Getting a list of project names.
     * 
     * @param projectList project list.
     * 
     * @return list of project names.
     */
    getProjectNameList(projectList: Project[]) {
        let projectNameList: string[] = [];
        projectList.forEach((project) => projectNameList.push(project.name));
        return projectNameList;
    }

    /**
     * Getting task with selected project ID.
     * 
     * @param projectID  id of project.
     * @param taskList  list of tasks.
     * 
     * @return task list of selected project.
     */
    getProjectTasksList(projectID: string, taskList: Task[]) {
        return taskList.filter((task) => task.projectId === projectID);
    }

    /**
    * Getting name of task project.
    * 
    * @param task selected task.
    * @param projectList list of projects.
    * 
    * @return name of task project.
    */
    getTaskProjectName(task: Task, projectList: Project[]) {
        let projectName = " ";

        const isProjectIsNew = task.projectId === EMPTY_INDEX;
        if (!isProjectIsNew) {
            let foundedProject = projectList.find(project => task.projectId === project.id);
            const project = foundedProject === undefined ? DEFAULT_EMPTY_ENTITY.project : foundedProject;

            projectName = project.name;
        }
        return projectName;
    }

    /**
     * Getting name of task executor.
     * 
     * @param executorId executor id of current task.
     * @param employeeList list of employees.
     * 
     * @return name of task executor.
     */
    getTaskExecutorName(executorId: string, employeeList: Employee[]) {
        let executorName = " ";

        const isExecutorIsNew = executorId === EMPTY_INDEX;
        if (!isExecutorIsNew) {
            let foundedEmployee = employeeList.find(employee => executorId === employee.id);
            const executor = foundedEmployee === undefined ? DEFAULT_EMPTY_ENTITY.employee : foundedEmployee;

            executorName = executor.lastName + " " + executor.firstName;
            const isMiddleNameNotEmpty = executor.middleName !== "";
            if (isMiddleNameNotEmpty) {
                executorName += " " + executor.middleName;
            }
        }
        return executorName;
    }

    /**
     * Getting status of task.
     * 
     * @param task selected task.
     * 
     * @return status of task.
     */
    getTaskStatus(task: Task) {
        let taskStatus = " "

        if (task.status !== "") {
            taskStatus = task.status;
        }
        return taskStatus;
    }
}