export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    avatar: string;
}