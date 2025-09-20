import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      revenues: 'Revenues',
      expenses: 'Expenses',
      goals: 'Goals',
      settings: 'Settings',

      // Common
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      confirm_delete: 'Confirm Delete',
      error: 'Error',
      success: 'Success',

      // Dashboard
      financial_overview: 'Financial Overview',
      total_revenues: 'Total Revenues',
      total_expenses: 'Total Expenses',
      savings: 'Savings',
      active_goals: 'Active Goals',
      remaining_balance: 'Remaining Balance',
      expenses_by_category: 'Expenses by Category',

      // Revenues
      manage_income_sources: 'Manage Your Income Sources',
      total_income: 'Total Income',
      remaining: 'Remaining',
      add_revenue: 'Add Revenue',
      edit_revenue: 'Edit Revenue',
      revenue_name: 'Revenue Name',
      amount: 'Amount',
      salary: 'Salary',
      freelance: 'Freelance',
      business: 'Business',
      investment: 'Investment',
      other: 'Other',

      // Expenses
      track_your_spending: 'Track Your Spending',
      add_expense: 'Add Expense',
      edit_expense: 'Edit Expense',
      manage_categories: 'Manage Categories',
      category_name: 'Category Name',
      description: 'Description',
      select_income_source: 'Select Income Source',
      insufficient_funds: 'Insufficient funds in selected income source',

      // Goals
      financial_goals: 'Financial Goals',
      achieve_your_dreams: 'Achieve Your Dreams',
      available_savings: 'Available Savings',
      add_goal: 'Add Goal',
      edit_goal: 'Edit Goal',
      goal_name: 'Goal Name',
      target_amount: 'Target Amount',
      deadline_yyyy_mm_dd: 'Deadline (YYYY-MM-DD)',
      days_left: 'days left',
      overdue: 'Overdue',
      completed: 'completed',
      contribute: 'Contribute',
      contribute_to_goal: 'Contribute to Goal',
      enter_contribution_amount: 'Enter contribution amount',
      invalid_contribution_amount: 'Invalid contribution amount',

      // Settings
      customize_your_experience: 'Customize Your Experience',
      profile: 'Profile',
      setup_profile: 'Setup Profile',
      tap_to_configure: 'Tap to configure',
      preferences: 'Preferences',
      language: 'Language',
      currency: 'Currency',
      notifications: 'Notifications',
      enable_notifications: 'Enable Notifications',
      daily_reminders: 'Daily reminders and alerts',
      export: 'Export',
      export_report: 'Export Monthly Report',
      generate_monthly_pdf: 'Generate monthly PDF report',
      adjust_savings: 'Adjust Savings',
      current_savings: 'Current Savings',
      amount_to_add_or_subtract: 'Amount to add (+) or subtract (-)',
      adjust: 'Adjust',

      // Onboarding
      welcome_to_mybudget: 'Welcome to MyBudget',
      lets_set_up_your_profile: 'Let\'s set up your profile to get started',
      first_name: 'First Name',
      last_name: 'Last Name',
      profession: 'Profession',
      salary_optional: 'Monthly Salary (Optional)',
      get_started: 'Get Started',
      your_data_stays_private: 'Your data stays private and secure on your device',

      // Languages
      language_en: 'English',
      language_fr: 'French',
      language_ar: 'Arabic',

      // Validation
      please_fill_all_fields: 'Please fill all required fields',
      name_required: 'First and last name are required',
      category_name_required: 'Category name is required',
      invalid_amount: 'Please enter a valid amount',

      // Confirmations
      delete_revenue_confirmation: 'Are you sure you want to delete this revenue source?',
      delete_expense_confirmation: 'Are you sure you want to delete this expense?',
      delete_goal_confirmation: 'Are you sure you want to delete this goal?',

      // Success messages
      report_exported_successfully: 'Report exported successfully',

      // Error messages
      failed_to_save_revenue: 'Failed to save revenue',
      failed_to_save_expense: 'Failed to save expense',
      failed_to_save_goal: 'Failed to save goal',
      failed_to_save_profile: 'Failed to save profile',
      failed_to_export_report: 'Failed to export report',
    },
  },
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de bord',
      revenues: 'Revenus',
      expenses: 'Dépenses',
      goals: 'Objectifs',
      settings: 'Paramètres',

      // Common
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      confirm_delete: 'Confirmer la suppression',
      error: 'Erreur',
      success: 'Succès',

      // Dashboard
      financial_overview: 'Aperçu financier',
      total_revenues: 'Revenus totaux',
      total_expenses: 'Dépenses totales',
      savings: 'Épargne',
      active_goals: 'Objectifs actifs',
      remaining_balance: 'Solde restant',
      expenses_by_category: 'Dépenses par catégorie',

      // Other translations...
      welcome_to_mybudget: 'Bienvenue dans MyBudget',
      lets_set_up_your_profile: 'Configurons votre profil pour commencer',
      first_name: 'Prénom',
      last_name: 'Nom de famille',
      profession: 'Profession',
      salary_optional: 'Salaire mensuel (Optionnel)',
      get_started: 'Commencer',
    },
  },
  ar: {
    translation: {
      // Navigation
      dashboard: 'لوحة التحكم',
      revenues: 'الإيرادات',
      expenses: 'المصروفات',
      goals: 'الأهداف',
      settings: 'الإعدادات',

      // Common
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تحرير',
      add: 'إضافة',
      confirm_delete: 'تأكيد الحذف',
      error: 'خطأ',
      success: 'نجح',

      // Dashboard
      financial_overview: 'نظرة عامة مالية',
      total_revenues: 'إجمالي الإيرادات',
      total_expenses: 'إجمالي المصروفات',
      savings: 'المدخرات',
      active_goals: 'الأهداف النشطة',
      remaining_balance: 'الرصيد المتبقي',
      expenses_by_category: 'المصروفات حسب الفئة',

      // Other translations...
      welcome_to_mybudget: 'مرحباً بك في ميزانيتي',
      lets_set_up_your_profile: 'دعنا نقوم بإعداد ملفك الشخصي للبدء',
      first_name: 'الاسم الأول',
      last_name: 'اسم العائلة',
      profession: 'المهنة',
      salary_optional: 'الراتب الشهري (اختياري)',
      get_started: 'ابدأ',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;