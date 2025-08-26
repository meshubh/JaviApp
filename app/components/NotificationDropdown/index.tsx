// app/components/NotificationDropdown/index.tsx
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useTheme } from '../../theme/themeContext';
import { useNotificationDropdownStyles } from './notification.styles';

interface Activity {
  order_id: string;
  order_number: string;
  status: string;
  icon: string;
  icon_color: string;
  description: string;
  time_ago: string;
  created_at: string;
}

interface NotificationDropdownProps {
  visible: boolean;
  activities: Activity[];
  onClose: () => void;
  onItemPress: (orderId: string) => void;
  onViewAllPress: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  visible,
  activities,
  onClose,
  onItemPress,
  onViewAllPress,
}) => {
  const { theme } = useTheme();
  const styles = useNotificationDropdownStyles(theme);
  
  const dropdownAnimation = useRef(new Animated.Value(0)).current;
  const backdropAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(backdropAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(dropdownAnimation, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(backdropAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dropdownAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const hasActivities = activities && activities.length > 0;

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          style={[
            styles.backdrop,
            {
              opacity: backdropAnimation,
            },
          ]} 
        />
      </TouchableWithoutFeedback>

      <Animated.View 
        style={[
          styles.dropdown,
          {
            opacity: dropdownAnimation,
            transform: [
              {
                translateY: dropdownAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
              {
                scale: dropdownAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Feather 
              name="bell" 
              size={18} 
              color={theme.colors.primary.main} 
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Recent Activity</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {hasActivities ? (
            <>
              {activities.slice(0, 5).map((activity) => (
                <TouchableOpacity
                  key={activity.order_id}
                  style={styles.activityItem}
                  onPress={() => {
                    onItemPress(activity.order_id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.activityLeft}>
                    <View 
                      style={[
                        styles.activityIconContainer,
                        { backgroundColor: activity.icon_color + '15' }
                      ]}
                    >
                      <Feather 
                        name={activity.icon as any} 
                        size={16} 
                        color={activity.icon_color} 
                      />
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={styles.activityDescription} numberOfLines={1}>
                        {activity.description}
                      </Text>
                      <Text style={styles.activityTime}>{activity.time_ago}</Text>
                    </View>
                  </View>
                  <Feather 
                    name="chevron-right" 
                    size={16} 
                    color={theme.colors.text.tertiary} 
                  />
                </TouchableOpacity>
              ))}

              {activities.length > 5 && (
                <View style={styles.moreIndicator}>
                  <Text style={styles.moreText}>
                    +{activities.length - 5} more activities
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Feather name="inbox" size={32} color={theme.colors.text.tertiary} />
              </View>
              <Text style={styles.emptyTitle}>No recent activity</Text>
              <Text style={styles.emptySubtitle}>
                Your order updates will appear here
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        {hasActivities && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity 
              style={styles.footer}
              onPress={() => {
                onViewAllPress();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.footerText}>View All Orders</Text>
              <Feather 
                name="arrow-right" 
                size={16} 
                color={theme.colors.primary.main} 
              />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
};

export default NotificationDropdown;