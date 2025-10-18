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

      // Revenues
      manage_income_sources: 'Gérez vos sources de revenus',
      total_income: 'Revenu total',
      remaining: 'Restant',
      add_revenue: 'Ajouter un revenu',
      edit_revenue: 'Modifier le revenu',
      revenue_name: 'Nom du revenu',
      amount: 'Montant',
      salary: 'Salaire',
      freelance: 'Freelance',
      business: 'Entreprise',
      investment: 'Investissement',
      other: 'Autre',

      // Expenses
      track_your_spending: 'Suivez vos dépenses',
      add_expense: 'Ajouter une dépense',
      edit_expense: 'Modifier la dépense',
      manage_categories: 'Gérer les catégories',
      category_name: 'Nom de la catégorie',
      description: 'Description',
      select_income_source: 'Sélectionner la source de revenus',
      insufficient_funds: 'Fonds insuffisants dans la source de revenus sélectionnée',

      // Goals
      financial_goals: 'Objectifs financiers',
      achieve_your_dreams: 'Réalisez vos rêves',
      available_savings: 'Épargne disponible',
      add_goal: 'Ajouter un objectif',
      edit_goal: 'Modifier l\'objectif',
      goal_name: 'Nom de l\'objectif',
      target_amount: 'Montant cible',
      deadline_yyyy_mm_dd: 'Date limite (AAAA-MM-JJ)',
      days_left: 'jours restants',
      overdue: 'En retard',
      completed: 'terminé',
      contribute: 'Contribuer',
      contribute_to_goal: 'Contribuer à l\'objectif',
      enter_contribution_amount: 'Entrez le montant de la contribution',
      invalid_contribution_amount: 'Montant de contribution invalide',

      // Settings
      customize_your_experience: 'Personnalisez votre expérience',
      profile: 'Profil',
      setup_profile: 'Configurer le profil',
      tap_to_configure: 'Appuyez pour configurer',
      preferences: 'Préférences',
      language: 'Langue',
      currency: 'Devise',
      notifications: 'Notifications',
      enable_notifications: 'Activer les notifications',
      daily_reminders: 'Rappels quotidiens et alertes',
      export: 'Exporter',
      export_report: 'Exporter le rapport mensuel',
      generate_monthly_pdf: 'Générer un rapport PDF mensuel',
      adjust_savings: 'Ajuster l\'épargne',
      current_savings: 'Épargne actuelle',
      amount_to_add_or_subtract: 'Montant à ajouter (+) ou soustraire (-)',
      adjust: 'Ajuster',
      edit_profile: 'Modifier le profil',

      // Onboarding
      welcome_to_budgy: 'Budgy',
      take_control_of_your_budget: 'Prenez le contrôle de votre budget',
      lets_set_up_your_profile: 'Configurons votre profil pour commencer',
      first_name: 'Prénom',
      last_name: 'Nom de famille',
      profession: 'Profession',
      salary_optional: 'Salaire mensuel (Optionnel)',
      start_budgeting: 'Commencer le budget',
      get_started: 'Commencer',
      your_data_stays_private: 'Vos données restent privées et sécurisées sur votre appareil',

      // Languages
      language_en: 'Anglais',
      language_fr: 'Français',
      language_ar: 'Arabe',

      // Validation
      please_fill_all_fields: 'Veuillez remplir tous les champs requis',
      name_required: 'Le prénom est requis',
      category_name_required: 'Le nom de la catégorie est requis',
      invalid_amount: 'Veuillez entrer un montant valide',

      // Confirmations
      delete_revenue_confirmation: 'Êtes-vous sûr de vouloir supprimer cette source de revenus?',
      delete_expense_confirmation: 'Êtes-vous sûr de vouloir supprimer cette dépense?',
      delete_goal_confirmation: 'Êtes-vous sûr de vouloir supprimer cet objectif?',

      // Success messages
      report_exported_successfully: 'Rapport exporté avec succès',

      // Error messages
      failed_to_save_revenue: 'Échec de l\'enregistrement du revenu',
      failed_to_save_expense: 'Échec de l\'enregistrement de la dépense',
      failed_to_save_goal: 'Échec de l\'enregistrement de l\'objectif',
      failed_to_save_profile: 'Échec de l\'enregistrement du profil',
      failed_to_export_report: 'Échec de l\'exportation du rapport',

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

      // Revenues
      manage_income_sources: 'إدارة مصادر الدخل',
      total_income: 'إجمالي الدخل',
      remaining: 'المتبقي',
      add_revenue: 'إضافة إيراد',
      edit_revenue: 'تحرير الإيراد',
      revenue_name: 'اسم الإيراد',
      amount: 'المبلغ',
      salary: 'راتب',
      freelance: 'عمل حر',
      business: 'أعمال',
      investment: 'استثمار',
      other: 'أخرى',

      // Expenses
      track_your_spending: 'تتبع إنفاقك',
      add_expense: 'إضافة مصروف',
      edit_expense: 'تحرير المصروف',
      manage_categories: 'إدارة الفئات',
      category_name: 'اسم الفئة',
      description: 'الوصف',
      select_income_source: 'اختر مصدر الدخل',
      insufficient_funds: 'أموال غير كافية في مصدر الدخل المحدد',

      // Goals
      financial_goals: 'الأهداف المالية',
      achieve_your_dreams: 'حقق أحلامك',
      available_savings: 'المدخرات المتاحة',
      add_goal: 'إضافة هدف',
      edit_goal: 'تحرير الهدف',
      goal_name: 'اسم الهدف',
      target_amount: 'المبلغ المستهدف',
      deadline_yyyy_mm_dd: 'الموعد النهائي (سنة-شهر-يوم)',
      days_left: 'أيام متبقية',
      overdue: 'متأخر',
      completed: 'مكتمل',
      contribute: 'المساهمة',
      contribute_to_goal: 'المساهمة في الهدف',
      enter_contribution_amount: 'أدخل مبلغ المساهمة',
      invalid_contribution_amount: 'مبلغ مساهمة غير صالح',

      // Settings
      customize_your_experience: 'خصص تجربتك',
      profile: 'الملف الشخصي',
      setup_profile: 'إعداد الملف الشخصي',
      tap_to_configure: 'اضغط للتكوين',
      preferences: 'التفضيلات',
      language: 'اللغة',
      currency: 'العملة',
      notifications: 'الإشعارات',
      enable_notifications: 'تفعيل الإشعارات',
      daily_reminders: 'تذكيرات يومية وتنبيهات',
      export: 'تصدير',
      export_report: 'تصدير التقرير الشهري',
      generate_monthly_pdf: 'إنشاء تقرير PDF شهري',
      adjust_savings: 'تعديل المدخرات',
      current_savings: 'المدخرات الحالية',
      amount_to_add_or_subtract: 'المبلغ المراد إضافته (+) أو طرحه (-)',
      adjust: 'تعديل',
      edit_profile: 'تحرير الملف الشخصي',

      // Onboarding
      welcome_to_budgy: 'بدجي',
      take_control_of_your_budget: 'تحكم في ميزانيتك',
      lets_set_up_your_profile: 'دعنا نقوم بإعداد ملفك الشخصي للبدء',
      first_name: 'الاسم الأول',
      last_name: 'اسم العائلة',
      profession: 'المهنة',
      salary_optional: 'الراتب الشهري (اختياري)',
      start_budgeting: 'ابدأ الميزانية',
      get_started: 'ابدأ',
      your_data_stays_private: 'تبقى بياناتك خاصة وآمنة على جهازك',

      // Languages
      language_en: 'الإنجليزية',
      language_fr: 'الفرنسية',
      language_ar: 'العربية',

      // Validation
      please_fill_all_fields: 'يرجى ملء جميع الحقول المطلوبة',
      name_required: 'الاسم الأول مطلوب',
      category_name_required: 'اسم الفئة مطلوب',
      invalid_amount: 'يرجى إدخال مبلغ صالح',

      // Confirmations
      delete_revenue_confirmation: 'هل أنت متأكد من حذف مصدر الإيراد هذا؟',
      delete_expense_confirmation: 'هل أنت متأكد من حذف هذا المصروف؟',
      delete_goal_confirmation: 'هل أنت متأكد من حذف هذا الهدف؟',

      // Success messages
      report_exported_successfully: 'تم تصدير التقرير بنجاح',

      // Error messages
      failed_to_save_revenue: 'فشل في حفظ الإيراد',
      failed_to_save_expense: 'فشل في حفظ المصروف',
      failed_to_save_goal: 'فشل في حفظ الهدف',
      failed_to_save_profile: 'فشل في حفظ الملف الشخصي',
      failed_to_export_report: 'فشل في تصدير التقرير',

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