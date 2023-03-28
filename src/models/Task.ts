/**
 * Model of task entity.
 * 
 * @param id id of the task.
 * @param type type of entity - task.
 * @param status status of the task.
 * @param name name of the task.
 * @param projectId id of the task project.
 * @param executionTime work time of the task.
 * @param employeeId id of the task executor. 
 * @param startDate start date of the task.
 * @param finishDate finish date of the task.
*/
export default interface Task {
    id: string;
    type: string;
    status: string;
    name: string;
    projectId: string;
    executionTime: string;
    employeeId: string;
    startDate: string;
    finishDate: string;
}

/**
 * String parameters of task.
 * 
 * @param name task name.
 * @param projectName name of task project.
 * @param executionTime work time of the task.
 * @param status status of the task.
 * @param startDate start date of the task.
 * @param finishDate finish date of the task.
 * @param executor full name of task executor.
*/
export const enum PARAMETERS_TASK {
    name = "Наименование",
    projectName = "Наименование проекта",
    executionTime = "Работа",
    status = "Статус",
    startDate = "Дата начала",
    finishDate = "Дата окончания",
    executor = "Исполнитель"
}

/**
 * List of english task status values.
*/
export const statusListENG = {
    "Не начата": "NOT_STARTED",
    "В процессе": "IN_PROGRESS",
    "Завершена": "COMPLETED",
    "Отложена": "POSTPONED",
}

/**
 * List of russian task status values.
*/
export const statusListRU = {
    "NOT_STARTED": "Не начата",
    "IN_PROGRESS": "В процессе",
    "COMPLETED": "Завершена",
    "POSTPONED": "Отложена",
}