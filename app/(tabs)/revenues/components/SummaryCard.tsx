import React, { useState } from 'react';
import {
    View,
    Text
} from 'react-native';
import { styles } from './style/revenues.styles';

export const SummaryCard = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
    </View>
);