export interface UserProfile {
    firstName: string;
    lastName: string;
    carryOverPreference?: 'weekly' | 'monthly';
}
