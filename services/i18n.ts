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
      categories: 'Categories',
      
      // Menu/UI
      soon: 'Soon',

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
      
      // Category Names
      rent: 'Rent',
      food: 'Food',
      transport: 'Transport',
      savings: 'Savings',
      
      // Categories Screen
      search_categories: 'Search categories',
      no_expense_categories: 'No expense categories found',
      no_revenue_categories: 'No revenue categories found',
      tap_plus_to_add: 'Tap the + button to add new categories',
      delete_category_confirm: 'Are you sure you want to delete this category?',
      enter_category_name: 'Enter category name',
      add_category: 'Add Category',
      edit_category: 'Edit Category',
      expense_category: 'Expense Category',
      revenue_type: 'Revenue Type',
      fixed: 'FIXED',
      
      // Revenue Components
      total_amount: 'Total Amount',
      
      // Notifications
      mybudget_reminder: 'MyBudget Reminder',
      daily_expense_reminder: "Don't forget to log your expenses today!",
      savings_goal: 'Savings Goal',
      weekly_savings_reminder: 'How about adding some money to your savings this week?',
      test_notification: 'Test Notification',
      test_notification_body: 'hello , thank you for testing our application, wiouuuu',
      budget_alert: 'Budget Alert!',
      budget_alert_body: "You've spent €{amount} in {category}, exceeding your limit of €{limit}",
      
      // Simulation Modal
      budget_simulation: 'Budget Simulation',
      select_category: 'Select Category',
      percentage_change: 'Percentage Change',
      percentage_change_placeholder: 'e.g., 10 for +10% or -10 for -10%',
      run_simulation: 'Run Simulation',
      simulation_results: 'Simulation Results',
      current_spending: 'Current Spending',
      simulated_spending: 'Simulated Spending',
      difference: 'Difference',
      close: 'Close',
      
      // Expense Deletion
      delete_expense: 'Delete Expense',
      delete_expense_confirm: 'Are you sure you want to delete this expense?',
      failed_to_delete_expense: 'Failed to delete expense',
      
      // Profile
      profile_updated: 'Profile updated successfully',
      
      // Savings Goals
      savings_goals: 'Savings Goals',
      track_your_financial_goals: 'Track your financial goals',
      total_savings: 'Total Savings',
      no_goals_yet: 'No Goals Yet',
      create_your_first_savings_goal_to_start_tracking_progress: 'Create your first savings goal to start tracking your progress towards financial freedom.',
      create_goal: 'Create Goal',
      your_goals: 'Your Goals',
      goal_title: 'Goal Title',
      enter_goal_title: 'Enter goal title',
      category: 'Category',
      enter_target_amount: 'Enter target amount',
      deadline: 'Deadline',
      optional: 'Optional',
      select_deadline: 'Select deadline',
      enter_description: 'Enter description',
      creating: 'Creating...',
      complete: 'Complete',
      current: 'Current',
      target: 'Target',
      add_money: 'Add Money',
      recent_transactions: 'Recent Transactions',
      no_transactions_yet: 'No transactions yet. Start saving to see your progress!',
      add_to: 'Add to',
      remaining: 'Remaining',
      quick_amounts: 'Quick amounts:',
      deduct_from: 'Deduct from',
      add_savings: 'Add Savings',
      enter_amount: 'Enter amount',
      please_enter_valid_amount: 'Please enter a valid amount',
      insufficient_funds_in_selected_revenue: 'Insufficient funds in selected revenue source',
      savings_for: 'Savings for',
      due: 'Due',
      general: 'General',
      emergency_fund: 'Emergency Fund',
      vacation: 'Vacation',
      house_property: 'House/Property',
      car_vehicle: 'Car/Vehicle',
      education: 'Education',
      goal_not_found: 'Goal not found',
      of: 'of',
      please_enter_goal_title: 'Please enter a goal title',
      please_enter_valid_target_amount: 'Please enter a valid target amount',
      failed_to_create_goal: 'Failed to create goal. Please try again.'
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
      categories: 'Catégories',
      
      // Menu/UI
      soon: 'Bientôt',

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
      
      // Category Names
      rent: 'Loyer',
      food: 'Nourriture',
      transport: 'Transport',
      savings: 'Épargne',
      
      // Categories Screen
      search_categories: 'Rechercher des catégories',
      no_expense_categories: 'Aucune catégorie de dépenses trouvée',
      no_revenue_categories: 'Aucune catégorie de revenus trouvée',
      tap_plus_to_add: 'Appuyez sur le bouton + pour ajouter de nouvelles catégories',
      delete_category_confirm: 'Êtes-vous sûr de vouloir supprimer cette catégorie?',
      enter_category_name: 'Entrez le nom de la catégorie',
      add_category: 'Ajouter une catégorie',
      edit_category: 'Modifier la catégorie',
      expense_category: 'Catégorie de dépenses',
      revenue_type: 'Type de revenus',
      fixed: 'FIXE',
      
      // Revenue Components
      total_amount: 'Montant total',
      
      // Notifications
      mybudget_reminder: 'Rappel MonBudget',
      daily_expense_reminder: "N'oubliez pas d'enregistrer vos dépenses aujourd'hui!",
      savings_goal: 'Objectif d\'épargne',
      weekly_savings_reminder: 'Que diriez-vous d\'ajouter de l\'argent à votre épargne cette semaine?',
      test_notification: 'Notification de test',
      test_notification_body: 'bonjour , merci de tester notre application, wiouuuu',
      budget_alert: 'Alerte budget!',
      budget_alert_body: 'Vous avez dépensé €{amount} dans {category}, dépassant votre limite de €{limit}',
      
      // Simulation Modal
      budget_simulation: 'Simulation de budget',
      select_category: 'Sélectionner une catégorie',
      percentage_change: 'Changement en pourcentage',
      percentage_change_placeholder: 'ex: 10 pour +10% ou -10 pour -10%',
      run_simulation: 'Exécuter la simulation',
      simulation_results: 'Résultats de la simulation',
      current_spending: 'Dépenses actuelles',
      simulated_spending: 'Dépenses simulées',
      difference: 'Différence',
      close: 'Fermer',
      
      // Expense Deletion
      delete_expense: 'Supprimer la dépense',
      delete_expense_confirm: 'Êtes-vous sûr de vouloir supprimer cette dépense?',
      failed_to_delete_expense: 'Échec de la suppression de la dépense',
      
      // Profile
      profile_updated: 'Profil mis à jour avec succès',
      
      // Savings Goals
      savings_goals: 'Objectifs d\'épargne',
      track_your_financial_goals: 'Suivez vos objectifs financiers',
      total_savings: 'Épargne totale',
      no_goals_yet: 'Aucun objectif pour le moment',
      create_your_first_savings_goal_to_start_tracking_progress: 'Créez votre premier objectif d\'épargne pour commencer à suivre vos progrès vers la liberté financière.',
      create_goal: 'Créer un objectif',
      your_goals: 'Vos objectifs',
      goal_title: 'Titre de l\'objectif',
      enter_goal_title: 'Entrez le titre de l\'objectif',
      category: 'Catégorie',
      enter_target_amount: 'Entrez le montant cible',
      deadline: 'Date limite',
      optional: 'Optionnel',
      select_deadline: 'Sélectionner la date limite',
      enter_description: 'Entrez la description',
      creating: 'Création...',
      complete: 'Terminé',
      current: 'Actuel',
      target: 'Cible',
      add_money: 'Ajouter de l\'argent',
      recent_transactions: 'Transactions récentes',
      no_transactions_yet: 'Aucune transaction pour le moment. Commencez à épargner pour voir vos progrès!',
      add_to: 'Ajouter à',
      remaining: 'Restant',
      quick_amounts: 'Montants rapides:',
      deduct_from: 'Déduire de',
      add_savings: 'Ajouter épargne',
      enter_amount: 'Entrez le montant',
      please_enter_valid_amount: 'Veuillez entrer un montant valide',
      insufficient_funds_in_selected_revenue: 'Fonds insuffisants dans la source de revenus sélectionnée',
      savings_for: 'Épargne pour',
      due: 'Échéance',
      general: 'Général',
      emergency_fund: 'Fonds d\'urgence',
      vacation: 'Vacances',
      house_property: 'Maison/Propriété',
      car_vehicle: 'Voiture/Véhicule',
      education: 'Éducation',
      goal_not_found: 'Objectif non trouvé',
      of: 'de',
      please_enter_goal_title: 'Veuillez entrer un titre d\'objectif',
      please_enter_valid_target_amount: 'Veuillez entrer un montant cible valide',
      failed_to_create_goal: 'Échec de la création de l\'objectif. Veuillez réessayer.'
    },
  },
  ar: {
    translation: {
      // Navigation
      dashboard: 'لوحة التحكم',
      revenues: 'الإيرادات',
      expenses: 'المصاريف',
      goals: 'الأهداف',
      settings: 'الإعدادات',
      categories: 'الفئات',
      
      // Menu/UI
      soon: 'قريباً',

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
      total_expenses: 'إجمالي المصاريف',
      savings: 'المدخرات',
      active_goals: 'الأهداف النشطة',
      remaining_balance: 'الرصيد المتبقي',
      expenses_by_category: 'المصاريف حسب الفئة',

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
      
      // Category Names
      rent: 'إيجار',
      food: 'طعام',
      transport: 'مواصلات',
      savings: 'مدخرات',
      
      // Categories Screen
      search_categories: 'البحث في الفئات',
      no_expense_categories: 'لم يتم العثور على فئات مصاريف',
      no_revenue_categories: 'لم يتم العثور على فئات إيرادات',
      tap_plus_to_add: 'اضغط على زر + لإضافة فئات جديدة',
      delete_category_confirm: 'هل أنت متأكد من حذف هذه الفئة؟',
      enter_category_name: 'أدخل اسم الفئة',
      add_category: 'إضافة فئة',
      edit_category: 'تحرير الفئة',
      expense_category: 'فئة المصاريف',
      revenue_type: 'نوع الإيرادات',
      fixed: 'ثابت',
      
      // Revenue Components
      total_amount: 'المبلغ الإجمالي',
      
      // Notifications
      mybudget_reminder: 'تذكير ميزانيتي',
      daily_expense_reminder: 'لا تنس تسجيل مصاريفك اليوم!',
      savings_goal: 'هدف الادخار',
      weekly_savings_reminder: 'ما رأيك في إضافة بعض المال إلى مدخراتك هذا الأسبوع؟',
      test_notification: 'إشعار تجريبي',
      test_notification_body: 'مرحبا ، شكرا لك لاختبار تطبيقنا ، ويووو',
      budget_alert: 'تنبيه الميزانية!',
      budget_alert_body: 'لقد أنفقت €{amount} في {category}، متجاوزاً حدك البالغ €{limit}',
      
      // Simulation Modal
      budget_simulation: 'محاكاة الميزانية',
      select_category: 'اختر الفئة',
      percentage_change: 'التغيير بالنسبة المئوية',
      percentage_change_placeholder: 'مثال: 10 لـ +10% أو -10 لـ -10%',
      run_simulation: 'تشغيل المحاكاة',
      simulation_results: 'نتائج المحاكاة',
      current_spending: 'الإنفاق الحالي',
      simulated_spending: 'الإنفاق المحاكى',
      difference: 'الفرق',
      close: 'إغلاق',
      
      // Expense Deletion
      delete_expense: 'حذف المصروف',
      delete_expense_confirm: 'هل أنت متأكد من حذف هذا المصروف؟',
      failed_to_delete_expense: 'فشل في حذف المصروف',
      
      // Profile
      profile_updated: 'تم تحديث الملف الشخصي بنجاح',
      
      // Savings Goals
      savings_goals: 'أهداف الادخار',
      track_your_financial_goals: 'تتبع أهدافك المالية',
      total_savings: 'إجمالي المدخرات',
      no_goals_yet: 'لا توجد أهداف بعد',
      create_your_first_savings_goal_to_start_tracking_progress: 'أنشئ هدف الادخار الأول لبدء تتبع تقدمك نحو الحرية المالية.',
      create_goal: 'إنشاء هدف',
      your_goals: 'أهدافك',
      goal_title: 'عنوان الهدف',
      enter_goal_title: 'أدخل عنوان الهدف',
      category: 'الفئة',
      enter_target_amount: 'أدخل المبلغ المستهدف',
      deadline: 'الموعد النهائي',
      optional: 'اختياري',
      select_deadline: 'اختر الموعد النهائي',
      enter_description: 'أدخل الوصف',
      creating: 'جاري الإنشاء...',
      complete: 'مكتمل',
      current: 'الحالي',
      target: 'الهدف',
      add_money: 'إضافة مال',
      recent_transactions: 'المعاملات الأخيرة',
      no_transactions_yet: 'لا توجد معاملات بعد. ابدأ الادخار لرؤية تقدمك!',
      add_to: 'إضافة إلى',
      remaining: 'المتبقي',
      quick_amounts: 'مبالغ سريعة:',
      deduct_from: 'خصم من',
      add_savings: 'إضافة مدخرات',
      enter_amount: 'أدخل المبلغ',
      please_enter_valid_amount: 'يرجى إدخال مبلغ صالح',
      insufficient_funds_in_selected_revenue: 'أموال غير كافية في مصدر الإيرادات المحدد',
      savings_for: 'مدخرات لـ',
      due: 'الاستحقاق',
      general: 'عام',
      emergency_fund: 'صندوق الطوارئ',
      vacation: 'إجازة',
      house_property: 'منزل/عقار',
      car_vehicle: 'سيارة/مركبة',
      education: 'تعليم',
      goal_not_found: 'الهدف غير موجود',
      of: 'من',
      please_enter_goal_title: 'يرجى إدخال عنوان الهدف',
      please_enter_valid_target_amount: 'يرجى إدخال مبلغ مستهدف صالح',
      failed_to_create_goal: 'فشل في إنشاء الهدف. يرجى المحاولة مرة أخرى.'
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