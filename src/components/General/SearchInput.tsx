import searchIcon from "components/General/search.svg";

import "components/General/SearchInput.css";

interface SearchInputProps {
    value: string;
    placeholderValue: string;
    onChange: (value: string) => void
}

export default function SearchInput({
    value,
    placeholderValue,
    onChange,
}: SearchInputProps) {
    function preventEvent(event: React.FormEvent) {
        event.preventDefault();
    }
    
    return (
        <form className="input-wrapper"
            onSubmit={preventEvent}
        >
            <input
                type="search"
                placeholder={placeholderValue}
                value={value}
                onChange={(event)=>onChange(event.target.value)}
            />
            <img
                className="search-icon"
                src={searchIcon}
                alt="Search Icon"
            />
        </form>
    )
}
