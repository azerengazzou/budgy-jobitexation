import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Home, TrendingUp, Target, ChartPie as PieChart, Tag } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="revenues"
        options={{
          title: 'Revenues',
          tabBarIcon: ({ size, color }) => <TrendingUp size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ size, color }) => <PieChart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ size, color }) => <Tag size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ size, color }) => (
            <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={size} color={color} />
              <View style={{
                position: 'absolute',
                top: -8,
                right: -10,
                backgroundColor: '#F59E0B',
                borderRadius: 8,
                paddingHorizontal: 6,
                paddingVertical: 2,
                minWidth: 28,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              }}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 9,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  lineHeight: 12,
                }}>Soon</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}