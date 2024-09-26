export interface IPost {
    id: number;
    userId: string;
    title: string;
    description: string;
    status: string;
    createDate: Date;
    updateDate: Date;
    postImage: string;
}