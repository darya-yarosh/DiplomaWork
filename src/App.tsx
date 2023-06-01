import { useEffect, useState } from 'react';
import config from "config.json";

import User, { EMPTY_USER } from 'models/User';

import AutorizationPage from 'components/Pages/AutorizationPage';
import AdminPage from 'components/Pages/AdminPage';
import HomePage from 'components/Pages/HomePage';

import 'App.css';

export const enum sectionForShow {
    entity = "Entity",
    entityList = "EntityList"
}

export interface StateApp {
    isLoadedData: boolean;
    showedSection: sectionForShow;
}

export default function App() {
    const [user, setUser] = useState<User>(EMPTY_USER);

    useEffect(() => {
        if (user.role === "user"|| user.role === "") {
            config.accessRights = "read";
        }
        else if (user.role === "admin") {
            config.accessRights = "write";
        }
    }, [user]);

    function handlerSetUser(user: User) {
        setUser(user);
    }

    function handlerLogOutClick() {
        if (window.confirm("Вы уверены, что хотите выйти из аккаунта?")) {
            window.alert("Пользователь вышел из системы.")            
            handlerSetUser(EMPTY_USER);
        }
    }

    const isWatcher = user.role === '';
    const isUser = (user.role === 'user' || user.role === 'admin');
    const isSuperAdmin = user.role === 'superadmin';

    return (
        <div className="app-wrapper">
            {isWatcher && <AutorizationPage handlerSetUser={handlerSetUser} />}
            {isSuperAdmin && <AdminPage handlerLogOutClick={handlerLogOutClick} />}
            {isUser && <HomePage handlerLogOutClick={handlerLogOutClick} />}
        </div>
    )
}