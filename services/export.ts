import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { storageService } from './storage';

class ExportService {
  async generateMonthlyReport(): Promise<void> {
    try {
      const [revenues, expenses, savings, goals, userProfile] = await Promise.all([
        storageService.getRevenues(),
        storageService.getExpenses(),
        storageService.getSavings(),
        storageService.getGoals(),
        storageService.getUserProfile(),
      ]);

      const currentMonth = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });

      const totalRevenues = revenues.reduce((sum, rev) => sum + rev.amount, 0);
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const totalSavings = savings.reduce((sum, sav) => sum + sav.amount, 0);
      const remainingBalance = totalRevenues - totalExpenses;

      // Group expenses by category
      const expensesByCategory = expenses.reduce((acc, expense) => {
        const existing = acc.find(item => item.category === expense.category);
        if (existing) {
          existing.total += expense.amount;
        } else {
          acc.push({ category: expense.category, total: expense.amount });
        }
        return acc;
      }, [] as { category: string; total: number }[]);

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>MyBudget Monthly Report - ${currentMonth}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #3B82F6;
              padding-bottom: 20px;
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: #1F2937;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 16px;
              color: #6B7280;
            }
            .user-info {
              background: #F8FAFC;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            .summary-card {
              background: #FFFFFF;
              border: 1px solid #E5E7EB;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .summary-card h3 {
              margin: 0 0 10px 0;
              font-size: 16px;
              color: #6B7280;
            }
            .summary-card .amount {
              font-size: 24px;
              font-weight: bold;
              color: #1F2937;
            }
            .positive { color: #10B981; }
            .negative { color: #EF4444; }
            .section {
              margin-bottom: 30px;
            }
            .section h2 {
              font-size: 20px;
              font-weight: bold;
              color: #1F2937;
              margin-bottom: 15px;
              border-bottom: 2px solid #E5E7EB;
              padding-bottom: 5px;
            }
            .list-item {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #F3F4F6;
            }
            .list-item:last-child {
              border-bottom: none;
            }
            .category-breakdown {
              background: #F8FAFC;
              padding: 15px;
              border-radius: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              color: #6B7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">MyBudget Monthly Report</h1>
            <p class="subtitle">${currentMonth}</p>
          </div>

          ${userProfile ? `
            <div class="user-info">
              <strong>${userProfile.firstName} ${userProfile.lastName}</strong><br>
              ${userProfile.profession}${userProfile.salary > 0 ? ` • Annual Salary: €${userProfile.salary.toLocaleString()}` : ''}
            </div>
          ` : ''}

          <div class="summary">
            <div class="summary-card">
              <h3>Total Revenues</h3>
              <div class="amount positive">€${totalRevenues.toFixed(2)}</div>
            </div>
            <div class="summary-card">
              <h3>Total Expenses</h3>
              <div class="amount negative">€${totalExpenses.toFixed(2)}</div>
            </div>
            <div class="summary-card">
              <h3>Remaining Balance</h3>
              <div class="amount ${remainingBalance >= 0 ? 'positive' : 'negative'}">
                €${remainingBalance.toFixed(2)}
              </div>
            </div>
            <div class="summary-card">
              <h3>Total Savings</h3>
              <div class="amount positive">€${totalSavings.toFixed(2)}</div>
            </div>
          </div>

          <div class="section">
            <h2>Revenue Sources</h2>
            ${revenues.map(revenue => `
              <div class="list-item">
                <span><strong>${revenue.name}</strong> (${revenue.type})</span>
                <span>€${revenue.amount.toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Expenses by Category</h2>
            <div class="category-breakdown">
              ${expensesByCategory.map(item => `
                <div class="list-item">
                  <span>${item.category}</span>
                  <span>€${item.total.toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <h2>Recent Expenses</h2>
            ${expenses.slice(-10).map(expense => `
              <div class="list-item">
                <span>
                  <strong>${expense.category}</strong><br>
                  <small style="color: #6B7280;">${expense.description} • ${new Date(expense.date).toLocaleDateString()}</small>
                </span>
                <span>€${expense.amount.toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Financial Goals</h2>
            ${goals.map(goal => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount * 100) : 0;
              return `
                <div class="list-item">
                  <span>
                    <strong>${goal.name}</strong><br>
                    <small style="color: #6B7280;">Target: €${goal.targetAmount.toFixed(2)} • Deadline: ${new Date(goal.deadline).toLocaleDateString()}</small><br>
                    <small style="color: #8B5CF6;">Progress: ${progress.toFixed(1)}% (€${goal.currentAmount.toFixed(2)})</small>
                  </span>
                  <span style="color: ${goal.completed ? '#10B981' : '#6B7280'}">
                    ${goal.completed ? '✓ Complete' : 'In Progress'}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <div class="footer">
            <p>Generated by MyBudget • ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Save to device and share
      const fileName = `MyBudget_Report_${currentMonth.replace(' ', '_')}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Monthly Report',
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

export const exportService = new ExportService();