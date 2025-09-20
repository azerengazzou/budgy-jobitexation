export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    description: string;
    completed: boolean;
    createdAt: string;
}