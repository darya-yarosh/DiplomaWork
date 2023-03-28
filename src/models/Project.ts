/**
 * Model of project entity.
 * 
 * @param id id of the project.
 * @param type type of entity - project.
 * @param name name of the project.
 * @param description description of the project.
 * @param shortName short name of project.
*/
export default interface Project {
    id: string;
    type: string;
    name: string;
    description: string;
    shortName: string;
}

/** 
 * String parameters of project.
 * 
 * @param name project name.
 * @param description project description.
 * @param taskList list of project tasks.
*/
export const enum PARAMETERS_PROJECT {
    name = "Наименование",
    description = "Описание",
    taskList = "Список задач проекта"
}