import { DEFAULT_EMPTY_ENTITY } from "models/Entity";
import Employee from "models/Employee";
import Task from "models/Task";
import Project from "models/Project";

export type Partition = EmployeePartitionInterface | TaskPartitionInterface | ProjectPartitionInterface;

/**
 * List of all partitions.
 *
 * @param employees partition of employees.
 * @param tasks partition of tasks.
 * @param projects partition of projects.
*/
export interface PartitionList {
    employees: EmployeePartitionInterface;
    tasks: TaskPartitionInterface;
    projects: ProjectPartitionInterface;
}

export interface EmployeePartitionInterface {
    title: string;
    entityList: Employee[];
    currentEntity: Employee;
    defaultEntity: Employee;
}

export interface TaskPartitionInterface {
    title: string;
    entityList: Task[];
    currentEntity: Task;
    defaultEntity: Task;
}

export interface ProjectPartitionInterface {
    title: string;
    entityList: Project[];
    currentEntity: Project;
    defaultEntity: Project;
}

/**
 * Partition of employees entities. 
 *
 * @param title the title of the employee partition.
 * @param entityList the list of employee entities.
 * @param currentEntity selected employee entity.
 * @param defaultEntity default employee entity.
*/
export const EmployeePartition: EmployeePartitionInterface = {
    title: "Сотрудники",
    entityList: [],
    currentEntity: { ...DEFAULT_EMPTY_ENTITY.employee },
    defaultEntity: { ...DEFAULT_EMPTY_ENTITY.employee },
}

/**
 * Partition of tasks entities. 
 *
 * @param title the title of the task partition.
 * @param entityList the list of task entities.
 * @param currentEntity selected task entity.
*/
export const TaskPartition: TaskPartitionInterface = {
    title: "Задачи",
    entityList: [],
    currentEntity: { ...DEFAULT_EMPTY_ENTITY.task },
    defaultEntity: { ...DEFAULT_EMPTY_ENTITY.task },
}

/**
 * Partition of projects entities. 
 *
 * @param title the title of the current partition.
 * @param entityList the list of current entities.
 * @param currentEntity selected project entity.
*/
export const ProjectsPartition: ProjectPartitionInterface = {
    title: "Проекты",
    entityList: [],
    currentEntity: { ...DEFAULT_EMPTY_ENTITY.project },
    defaultEntity: { ...DEFAULT_EMPTY_ENTITY.project },
}