import { useEffect, useState } from "react";

import { BUTTON } from "models/InterfaceConstants";
import User, { EMPTY_USER } from "models/User";

import Header from "components/General/Header";

import { handleAddUser, handleGetUserList } from "logic/storage/firebase/UsersController";

import 'components/Pages/AutorizationPage.css';
import Footer from "components/General/Footer";

interface AutorizationPageProps {
    handlerSetUser: (user: User) => void
}

export default function AutorizationPage({
    handlerSetUser
}: AutorizationPageProps) {
    const [userList, setUserList] = useState<User[]>([]);
    const [user, setUser] = useState<User>({ ...EMPTY_USER });

    useEffect(() => {
        return () => {
            handleGetUserList().then((loadedUserList) => {
                setUserList(loadedUserList as User[]);
            })
        }
    }, []);

    function handlerLoginInput(login: string) {
        const updatedUser = { ...user };
        updatedUser.login = login;
        setUser(updatedUser);
    }

    function handlerPasswordInput(password: string) {
        const updatedUser = { ...user };
        updatedUser.password = password;
        setUser(updatedUser);
    }

    function isCorrectSignIn(user: User, userList: User[]): boolean {
        // проверка что мин.длина логина - 5 символов
        const isCorrectLengthLogin = user.login.length >= 5;
        if (!isCorrectLengthLogin) {
            window.alert("Некорректный логин: минимальная длина - 5 символов.");
            return false;
        }
        // проверка что мин.длина пароля - 4 символа
        const isCorrectLengthPassword = user.password.length >= 4;
        if (!isCorrectLengthPassword) {
            window.alert("Некорректный пароль: минимальная длина - 4 символа.");
            return false;
        }
        // проверка что логин из латиницы (и цифр)
        const isLatinWithNumbersLogin = /[A-Za-z0-9]/i.test(user.login);
        if (!isLatinWithNumbersLogin) {
            window.alert("Некорректный логин: логин должен состоять из латиницы (и цифр).");
            return false;
        }
        // проверка что пароль из латиницы (и цифр)
        const isLatinWithNumbersPassword = /[A-Za-z0-9]/i.test(user.password);
        if (!isLatinWithNumbersPassword) {
            window.alert("Некорректный пароль: логин должен состоять из латиницы (и цифр).");
            return false;
        }
        // проверка что логин не занят
        const occupiedUser = userList.find(userItem => userItem.login === user.login);
        if (occupiedUser !== undefined) {
            window.alert("Некорректный логин: данный логин уже занят.");
            return false;
        }

        return true;
    }

    function signIn() {
        const isValidUserData = isCorrectSignIn(user, userList);
        if (!isValidUserData) {
            return;
        }

        handleAddUser(user);
        handleGetUserList().then((loadedUserList) => {
            const updatedUserList = loadedUserList as User[];
            const signedInUser = updatedUserList.find(userItem => userItem.login === user.login);

            if (signedInUser !== undefined) {
                handlerSetUser(signedInUser);
            }
        })
    }

    function isCorrectLogIn(user: User, userList: User[]): boolean {
        // проверка что логин не занят
        const occupiedUser = userList.find(userItem => userItem.login === user.login);
        if (occupiedUser === undefined) {
            window.alert("Некорректный логин: данного логина не существует.");
            return false;
        }
        // проверка что пароль верный
        const isCorrectPassword = occupiedUser.password === user.password;
        if (!isCorrectPassword) {
            window.alert("Некорректный пароль: неправильно набран пароль.");
            return false;
        }

        return true;
    }

    function logIn() {
        const isValidUserData = isCorrectLogIn(user, userList);
        if (!isValidUserData) {
            return;
        }

        const loginedInUser = userList.find(userItem => userItem.login === user.login);
        if (loginedInUser !== undefined) {
            handlerSetUser(loginedInUser);
        }
    }

    return (
        <>
            <div className="autorization-header">
                <Header section="Авторизация" />
            </div>
            <div className="autorization-wrapper">
                <form className="autorization-form" onSubmit={(event) => event.preventDefault()}>
                    <label>Логин</label>
                    <input type="text" value={user.login} onChange={(event) => handlerLoginInput(event.target.value)} />
                    <label>Пароль</label>
                    <input type="password" value={user.password} autoComplete="on" onChange={(event) => handlerPasswordInput(event.target.value)} />
                    <div className="autorization-form-btn-nav">
                        <button type="button" className="btn btn-dangerous" onClick={signIn}>{BUTTON.signIn}</button>
                        <button type="button" className="btn btn-success" onClick={logIn}>{BUTTON.logIn}</button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    )
}