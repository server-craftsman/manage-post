export interface IPost {
    id: number;
    userId: string;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    postImage: string;
}