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
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="revenues"
        options={{
          title: 'Revenues',
          tabBarIcon: ({ size, color }) => (
            <TrendingUp size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ size, color }) => (
            <PieChart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ size, color }) => (
            <Tag size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarIcon: ({ size, color }) => (
            <View style={{ position: 'relative' }}>
              <Target size={size} color={color || "#9CA3AF"} />
              <View style={{
                position: 'absolute',
                top: -6,
                right: -8,
                backgroundColor: '#F59E0B',
                borderRadius: 6,
                paddingHorizontal: 4,
                paddingVertical: 1,
                minWidth: 24,
              }}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 8,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>Soon</Text>
              </View>
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            color: '#9CA3AF',
          },
          tabBarButton: (props) => (
            <View style={props.style}>
              {props.children}
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