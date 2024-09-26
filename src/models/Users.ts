export interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createDate: Date;
    updateDate: Date;
    avatar: string;
}