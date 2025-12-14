import { Revenue } from '@/components/interfaces/revenues';
import { Expense } from '@/components/interfaces/expenses';
import { Goal } from '@/components/interfaces/savings';

export type AdvicePriority = 'critical' | 'high' | 'medium' | 'low';
export type AdviceCategory = 'spending' | 'income' | 'savings' | 'goals' | 'health';

export interface FinancialAdvice {
  id: string;
  category: AdviceCategory;
  priority: AdvicePriority;
  title: string;
  message: string;
  action?: string;
  actionRoute?: string;
  icon: string;
}

export class FinancialAdvisor {
  private revenues: Revenue[];
  private expenses: Expense[];
  private goals: Goal[];

  constructor(revenues: Revenue[], expenses: Expense[], goals: Goal[]) {
    this.revenues = revenues;
    this.expenses = expenses;
    this.goals = goals;
  }

  private getTotalRevenues(): number {
    return this.revenues.reduce((sum, r) => sum + r.amount, 0);
  }

  private getTotalExpenses(): number {
    return this.expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  private getTotalSavings(): number {
    return this.goals.reduce((sum, g) => sum + g.currentAmount, 0);
  }

  private getExpenseRate(): number {
    const total = this.getTotalRevenues();
    return total > 0 ? (this.getTotalExpenses() / total) * 100 : 0;
  }

  private getSavingsRate(): number {
    const total = this.getTotalRevenues();
    return total > 0 ? (this.getTotalSavings() / total) * 100 : 0;
  }

  private getExpensesByCategory(): Map<string, number> {
    const map = new Map<string, number>();
    this.expenses.forEach(e => {
      map.set(e.category, (map.get(e.category) || 0) + e.amount);
    });
    return map;
  }

  private getTopSpendingCategory(): { name: string; amount: number; percentage: number } | null {
    const byCategory = this.getExpensesByCategory();
    if (byCategory.size === 0) return null;
    
    let top = { name: '', amount: 0 };
    byCategory.forEach((amount, name) => {
      if (amount > top.amount) top = { name, amount };
    });
    
    const total = this.getTotalExpenses();
    return { ...top, percentage: total > 0 ? (top.amount / total) * 100 : 0 };
  }

  private getActiveGoals(): Goal[] {
    return this.goals.filter(g => g.status === 'active');
  }

  private getGoalProgress(goal: Goal): number {
    return (goal.currentAmount / goal.targetAmount) * 100;
  }

  private getStrugglingGoals(): Goal[] {
    return this.getActiveGoals().filter(g => this.getGoalProgress(g) < 30);
  }

  private getBalance(): number {
    return this.getTotalRevenues() - this.getTotalExpenses() - this.getTotalSavings();
  }

  generateAdvice(): FinancialAdvice[] {
    const advice: FinancialAdvice[] = [];
    const totalRevenues = this.getTotalRevenues();
    const totalExpenses = this.getTotalExpenses();
    const expenseRate = this.getExpenseRate();
    const savingsRate = this.getSavingsRate();
    const balance = this.getBalance();

    // Critical: Deficit situation
    if (balance < 0) {
      advice.push({
        id: 'deficit',
        category: 'health',
        priority: 'critical',
        title: 'advice_deficit_title',
        message: 'advice_deficit_msg',
        action: 'create_budget',
        actionRoute: '/(tabs)/expenses',
        icon: 'alert'
      });
    }

    // Critical: Very high expense rate
    if (expenseRate > 85 && totalRevenues > 0) {
      advice.push({
        id: 'critical_expenses',
        category: 'spending',
        priority: 'critical',
        title: 'advice_critical_spending_title',
        message: 'advice_critical_spending_msg',
        action: 'cut_expenses',
        actionRoute: '/(tabs)/expenses',
        icon: 'alert'
      });
    }

    // High: Overspending category
    const topCategory = this.getTopSpendingCategory();
    if (topCategory && topCategory.percentage > 40) {
      advice.push({
        id: 'high_category',
        category: 'spending',
        priority: 'high',
        title: 'advice_category_high_title',
        message: 'advice_category_high_msg',
        action: 'review_category',
        actionRoute: '/(tabs)/expenses',
        icon: 'warning'
      });
    }

    // High: Low savings rate
    if (savingsRate < 10 && totalRevenues > 0 && expenseRate < 85) {
      advice.push({
        id: 'low_savings',
        category: 'savings',
        priority: 'high',
        title: 'advice_low_savings_title',
        message: 'advice_low_savings_msg',
        action: 'increase_savings',
        actionRoute: '/(tabs)/goals',
        icon: 'warning'
      });
    }

    // Medium: Struggling goals
    const strugglingGoals = this.getStrugglingGoals();
    if (strugglingGoals.length > 0) {
      advice.push({
        id: 'struggling_goals',
        category: 'goals',
        priority: 'medium',
        title: 'advice_goals_behind_title',
        message: 'advice_goals_behind_msg',
        action: 'contribute',
        actionRoute: '/(tabs)/goals',
        icon: 'info'
      });
    }

    // Medium: No income sources
    if (totalRevenues === 0) {
      advice.push({
        id: 'no_income',
        category: 'income',
        priority: 'medium',
        title: 'advice_no_income_title',
        message: 'advice_no_income_msg',
        action: 'add_revenue',
        actionRoute: '/(tabs)/revenues',
        icon: 'info'
      });
    }

    // Medium: No savings goals
    if (this.getActiveGoals().length === 0 && totalRevenues > 0) {
      advice.push({
        id: 'no_goals',
        category: 'goals',
        priority: 'medium',
        title: 'advice_no_goals_title',
        message: 'advice_no_goals_msg',
        action: 'add_goal',
        actionRoute: '/(tabs)/goals',
        icon: 'info'
      });
    }

    // Low: Optimize savings allocation
    if (savingsRate >= 10 && savingsRate < 20 && balance > 0) {
      advice.push({
        id: 'optimize_savings',
        category: 'savings',
        priority: 'low',
        title: 'advice_optimize_savings_title',
        message: 'advice_optimize_savings_msg',
        action: 'contribute',
        actionRoute: '/(tabs)/goals',
        icon: 'success'
      });
    }

    // Low: Excellent financial health
    if (expenseRate < 60 && savingsRate >= 20) {
      advice.push({
        id: 'excellent_health',
        category: 'health',
        priority: 'low',
        title: 'advice_excellent_title',
        message: 'advice_excellent_msg',
        icon: 'success'
      });
    }

    return advice.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  getTopAdvice(limit: number = 3): FinancialAdvice[] {
    return this.generateAdvice().slice(0, limit);
  }
}
