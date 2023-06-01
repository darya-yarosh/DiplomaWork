import { useEffect, useState } from "react";

import User, { EMPTY_USER } from "models/User";

import Header from "components/General/Header";

import { handleGetUser, handleGetUserList, handleRemoveUser, handleUpdateUser } from "logic/storage/firebase/UsersController";

import "components/Pages/AdminPage.css";
import { BUTTON } from "models/InterfaceConstants";
import Footer from "components/General/Footer";

interface AdminPageProps {
    handlerLogOutClick: () => void
}
export default function AdminPage({
    handlerLogOutClick
}: AdminPageProps) {
    const [userList, setUserList] = useState<User[]>([]);

    function loadUserList() {
        handleGetUserList().then((loadedUserList) => {
            setUserList(loadedUserList as User[]);
        })
    }

    useEffect(() => {
        return () => {
            loadUserList();
        }
    }, []);

    function onRoleChange(userId: string, newRole: string) {
        handleGetUser(userId).then((loadedUser) => {
            const updatedUser = loadedUser as User;
            updatedUser.role = newRole;
            handleUpdateUser(userId, updatedUser);
            loadUserList();
        })
    }

    function onRemoveUser(userId: string) {
        const removedUser = userList.find(user => user.id === userId) || EMPTY_USER;
        if (window.confirm(`Вы уверены что хотите удалить пользователя ${removedUser.login}?`)) {
            handleRemoveUser(userId).then(() => loadUserList());
            window.alert(`Пользователь ${removedUser.login} успешно удалён.`)
        }
    }

    const filteredUserList = userList.filter((user) => user.login !== "admin");

    return <>
        <div className="admin-page-header">
            <Header section="Администрирование" handlerLogOutClick={handlerLogOutClick} />
        </div>
        <div className="admin-page-wrapper">
            <h1>Аккаунты</h1>
            <table className="user-roles-table">
                <tr>
                    <th>Пользователь</th>
                    <th>Роль</th>
                    <th>Навигация</th>
                </tr>
                {filteredUserList.map((user) => {
                    const adminRoleId = "admin-role " + user.id;
                    const userRoleId = "user-role " + user.id;

                    const adminLabelClassName = user.role === "admin" ? "admin-label checked-role" : "admin-label";
                    const userLabelClassName = user.role === "user" ? "user-label checked-role" : "user-label";
                    return (
                        <tr key={user.id}>
                            <td>{user.login}</td>
                            <td className="role-changer">
                                <p><input id={adminRoleId} className="invisible" type="radio" value="admin" checked={user.role === "admin"} onChange={(event) => {
                                    onRoleChange(user.id, event.target.value);
                                }} />
                                    <label className={adminLabelClassName} htmlFor={adminRoleId}>Администратор</label></p>
                                <p><input id={userRoleId} className="invisible" type="radio" value="user" checked={user.role === "user"} onChange={(event) => {
                                    onRoleChange(user.id, event.target.value);
                                }} />
                                    <label className={userLabelClassName} htmlFor={userRoleId}>Пользователь</label></p>
                            </td>
                            <td>
                                <button className="btn-dangerous" onClick={() => onRemoveUser(user.id)}>
                                    {BUTTON.delete}
                                </button>
                            </td>
                        </tr>
                    )
                }
                )}
            </table>
        </div>
        <Footer />
    </>
}