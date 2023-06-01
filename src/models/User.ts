export default interface User {
    id: string;
    login: string;
    password: string;
    role: string;
}

export const EMPTY_USER: User = {
    id: '',
    login: '',
    password: '',
    role: '',
};