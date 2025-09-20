export interface Revenue {
    id: string;
    name: string;
    amount: number;
    type: 'salary' | 'freelance' | 'business' | 'investment' | 'other';
    remainingAmount: number;
    createdAt: string;
}