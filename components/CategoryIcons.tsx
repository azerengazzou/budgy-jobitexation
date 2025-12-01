import React from 'react';
import {
  DollarSign,
  Home,
  Car,
  Coffee,
  ShoppingBag,
  Gamepad2,
  Heart,
  Briefcase,
  TrendingUp,
  PiggyBank,
  Zap,
  Smartphone,
  GraduationCap,
  Plane,
  Gift,
  Wrench,
  Users,
  Building,
  CreditCard,
  Wallet
} from 'lucide-react-native';

export const getCategoryIcon = (category: string, type: 'expense' | 'revenue' = 'expense') => {
  const categoryLower = category.toLowerCase();
  
  if (type === 'revenue') {
    switch (categoryLower) {
      case 'salary': return Briefcase;
      case 'freelance': return TrendingUp;
      case 'business': return Building;
      case 'investment': return PiggyBank;
      default: return Wallet;
    }
  }
  
  // Expense categories
  switch (categoryLower) {
    case 'rent': case 'housing': return Home;
    case 'food': case 'groceries': case 'dining': return Coffee;
    case 'transport': case 'transportation': case 'fuel': return Car;
    case 'shopping': case 'clothes': case 'clothing': return ShoppingBag;
    case 'entertainment': case 'games': return Gamepad2;
    case 'health': case 'medical': case 'healthcare': return Heart;
    case 'utilities': case 'electricity': case 'water': return Zap;
    case 'phone': case 'internet': case 'mobile': return Smartphone;
    case 'education': case 'books': case 'courses': return GraduationCap;
    case 'travel': case 'vacation': case 'holiday': return Plane;
    case 'gifts': case 'donations': return Gift;
    case 'maintenance': case 'repairs': return Wrench;
    case 'family': case 'kids': case 'children': return Users;
    case 'insurance': case 'subscriptions': return CreditCard;
    default: return DollarSign;
  }
};

export const CategoryIcon = ({ 
  category, 
  type = 'expense', 
  size = 20, 
  color = '#6B7280' 
}: {
  category: string;
  type?: 'expense' | 'revenue';
  size?: number;
  color?: string;
}) => {
  const IconComponent = getCategoryIcon(category, type);
  return <IconComponent size={size} color={color} />;
};