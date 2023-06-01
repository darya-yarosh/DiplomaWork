import { useState } from "react";
import { getFilteredEntityList } from "logic/utils/Helper";

import { Partition } from "models/Partition"
import EntityCard from "components/Entity/EntityCard";

import "components/Partition/PartitionPage.css";
import EMPTY_INDEX from "logic/utils/EmptyIndex";
import SearchInput from "components/General/SearchInput";

interface PartitionPageProps {
    partition: Partition;
    openEntityPage: (entityId: string) => void;
}

export default function PartitionPage({
    partition,
    openEntityPage,
}
    : PartitionPageProps) {
    const [searchFilter, setSearchFilter] = useState<string>("");

    const entityType = partition.id;
    const filteredEntityList = searchFilter === ""
        ? partition.entityList
        : getFilteredEntityList(partition.entityList, entityType, searchFilter);

    return (
        <div className="partition">
            <div className="partition-header">
                <h1 className="partition-title"> {partition.title}</h1>
                <div className="partition-tools">
                    <SearchInput
                        value={searchFilter}
                        onChange={setSearchFilter}
                        placeholderValue="Поиск"
                    />
                    <button className="btn btn-dangerous"
                        type="button"
                        onClick={() => openEntityPage(EMPTY_INDEX)}
                    >
                        Новая запись
                    </button>
                </div>
            </div>
            <section className="partition-elements-list">
                {filteredEntityList.map((entity) =>
                    <EntityCard
                        key={entity.id}
                        entityType={entityType}
                        entity={entity}
                        openEntityPage={openEntityPage}
                    />
                )}
            </section>
        </div>
    )
}