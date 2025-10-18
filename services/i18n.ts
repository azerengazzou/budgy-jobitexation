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
      welcome_to_budgy: 'Budgy',
      take_control_of_your_budget: 'Take control of your budget',
      lets_set_up_your_profile: 'Let\'s set up your profile to get started',
      first_name: 'First Name',
      last_name: 'Last Name',
      profession: 'Profession',
      salary_optional: 'Monthly Salary (Optional)',
      start_budgeting: 'Start Budgeting',
      get_started: 'Get Started',
      your_data_stays_private: 'Your data stays private and secure on your device',

      // Languages
      language_en: 'English',
      language_fr: 'French',
      language_ar: 'Arabic',

      // Validation
      please_fill_all_fields: 'Please fill all required fields',
      name_required: 'First name is required',
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

      // Coming Soon
      coming_soon: 'Coming Soon',
      financial_goals_coming_soon: 'Financial goals and planning features will be available in a future update.',

      // Data Management
      data_management: 'Data Management',
      delete_all_data: 'Delete All Data',
      delete_all_data_confirmation: 'This will permanently delete all your data including revenues, expenses, and settings. This action cannot be undone.',
      permanently_delete_all_data: 'Permanently delete all app data',
      all_data_deleted: 'All data has been deleted successfully',
      failed_to_delete_data: 'Failed to delete data',
      ok: 'OK',
      manual_savings_adjustment: 'Manual savings adjustment',
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
      welcome_to_budgy: 'Budgy',
      take_control_of_your_budget: 'Prenez le contrôle de votre budget',
      lets_set_up_your_profile: 'Configurons votre profil pour commencer',
      first_name: 'Prénom',
      last_name: 'Nom de famille',
      profession: 'Profession',
      salary_optional: 'Salaire mensuel (Optionnel)',
      start_budgeting: 'Commencer le budget',
      get_started: 'Commencer',

      // Coming Soon
      coming_soon: 'Bientôt disponible',
      financial_goals_coming_soon: 'Les fonctionnalités d\'objectifs financiers et de planification seront disponibles dans une future mise à jour.',

      // Data Management
      data_management: 'Gestion des données',
      delete_all_data: 'Supprimer toutes les données',
      delete_all_data_confirmation: 'Cela supprimera définitivement toutes vos données y compris les revenus, dépenses et paramètres. Cette action ne peut pas être annulée.',
      permanently_delete_all_data: 'Supprimer définitivement toutes les données de l\'application',
      all_data_deleted: 'Toutes les données ont été supprimées avec succès',
      failed_to_delete_data: 'Échec de la suppression des données',
      ok: 'OK',
      manual_savings_adjustment: 'Ajustement manuel de l\'épargne',
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
      welcome_to_budgy: 'بدجي',
      take_control_of_your_budget: 'تحكم في ميزانيتك',
      lets_set_up_your_profile: 'دعنا نقوم بإعداد ملفك الشخصي للبدء',
      first_name: 'الاسم الأول',
      last_name: 'اسم العائلة',
      profession: 'المهنة',
      salary_optional: 'الراتب الشهري (اختياري)',
      start_budgeting: 'ابدأ الميزانية',
      get_started: 'ابدأ',

      // Coming Soon
      coming_soon: 'قريباً',
      financial_goals_coming_soon: 'ستكون ميزات الأهداف المالية والتخطيط متاحة في تحديث مستقبلي.',

      // Data Management
      data_management: 'إدارة البيانات',
      delete_all_data: 'حذف جميع البيانات',
      delete_all_data_confirmation: 'سيؤدي هذا إلى حذف جميع بياناتك نهائياً بما في ذلك الإيرادات والمصروفات والإعدادات. لا يمكن التراجع عن هذا الإجراء.',
      permanently_delete_all_data: 'حذف جميع بيانات التطبيق نهائياً',
      all_data_deleted: 'تم حذف جميع البيانات بنجاح',
      failed_to_delete_data: 'فشل في حذف البيانات',
      ok: 'موافق',
      manual_savings_adjustment: 'تعديل يدوي للمدخرات',
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