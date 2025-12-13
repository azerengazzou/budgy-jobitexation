export interface Revenue {
    id: string;
    name: string;
    amount: number;
    type: 'salary' | 'freelance';
    remainingAmount: number;
    createdAt: string;
}

export interface RevenueTransaction {
    id: string;
    revenueTypeId: string;
    name: string;
    amount: number;
    date: string;
    createdAt: string;
}

export type RevenueForm = {
    name: string;
    amount: string;
    type: Revenue['type'];
    date: Date;
};