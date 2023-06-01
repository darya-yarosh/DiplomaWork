import { Partition, PartitionList } from "models/Partition";

import "components/Partition/PartitionNav.css";

interface PartitionsNavProps {
    partitionList: PartitionList;
    changeCurrentPartition: (nextPartition: Partition) => void;
}

export default function PartitionNav({
    partitionList,
    changeCurrentPartition
}: PartitionsNavProps) {
    const partitionListData = Object.entries(partitionList);
    
    return (
        <nav className="nav-tools">
            <ul>
                {(partitionListData).map((partition: [string, Partition]) =>
                    <li key={partition[0]}>
                        <span onClick={() => { changeCurrentPartition(partition[1]); }}>
                            &nbsp;{partition[1].title}&nbsp;
                        </span>
                    </li>
                )}
            </ul>
        </nav>
    )
}