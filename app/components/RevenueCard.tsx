import { Revenue } from "./interfaces/revenues";
import { styles } from "./style/revenues.styles";
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { Plus, CreditCard as Edit3, Trash2 } from 'lucide-react-native';

export const RevenueCard = ({
    revenue,
    onEdit,
    onDelete,
    t,
}: {
    revenue: Revenue;
    onEdit: () => void;
    onDelete: () => void;
    t: (key: string) => string;
}) => (
    <View style={styles.revenueCard}>
        <View style={styles.revenueHeader}>
            <View>
                <Text style={styles.revenueName}>{revenue.name}</Text>
                <Text style={styles.revenueType}>{revenue.type}</Text>
            </View>
            <View style={styles.revenueActions}>
                <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                    <Edit3 size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                    <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.revenueAmounts}>
            <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>{t('total_amount')}</Text>
                <Text style={styles.amountValue}>€{revenue.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>{t('remaining')}</Text>
                <Text
                    style={[
                        styles.amountValue,
                        { color: revenue.remainingAmount > 0 ? '#10B981' : '#EF4444' },
                    ]}
                >
                    €{revenue.remainingAmount.toFixed(2)}
                </Text>
            </View>
        </View>
    </View>
);