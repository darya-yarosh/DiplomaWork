import { createContext } from 'react';

import { PartitionList, EmployeePartition, TaskPartition, ProjectsPartition } from 'models/Partition';

/**
 * Context of all partition list.
 * 
 * @param employees employees partition.
 * @param tasks tasks partition.
 * @param projects projects partition.
 */
export const PartitionListContext = createContext<PartitionList>({
    employees: EmployeePartition,
    tasks: TaskPartition,
    projects: ProjectsPartition,
});