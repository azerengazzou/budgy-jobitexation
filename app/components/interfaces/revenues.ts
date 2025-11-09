export interface Revenue {
    id: string;
    name: string;
    amount: number;
    type: 'salary' | 'freelance' | 'business' | 'investment' | 'other';
    remainingAmount: number;
    createdAt: string;
}

export type RevenueForm = {
    name: string;
    amount: string;
    type: Revenue['type'];
    date: Date;
};