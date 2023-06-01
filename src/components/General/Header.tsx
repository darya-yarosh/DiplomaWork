import { SITE_INFO } from "models/InterfaceConstants";

import "components/General/Header.css";

interface HeaderProps {
    section?: string;
    handlerLogOutClick?: () => void;
}

export default function Header({
    section = "",
    handlerLogOutClick = undefined,
}: HeaderProps) {

    return (
        <header className="header">
            <h1 className="app-name">
                <span>{SITE_INFO.header}</span>
                <span>{section !== "" && ` | ${section}`}</span>
            </h1>
            {handlerLogOutClick !== undefined &&
                <button type="button" className="btn btn-dangerous" onClick={handlerLogOutClick}>Выйти</button>
            }
        </header>
    )
}