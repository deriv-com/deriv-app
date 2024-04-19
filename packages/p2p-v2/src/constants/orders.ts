export const ORDERS_STATUS = {
    ACTIVE_ORDERS: 'Active orders',
    BUYER_CONFIRMED: 'buyer-confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    DISPUTE_COMPLETED: 'dispute-completed',
    DISPUTE_REFUNDED: 'dispute-refunded',
    DISPUTED: 'disputed',
    PAST_ORDERS: 'Past orders',
    PENDING: 'pending',
    REFUNDED: 'refunded',
    TIMED_OUT: 'timed-out',
} as const;

//TODO: Below constant to be removed once list is fetched from API
export const ORDER_COMPLETION_TIME_LIST = [
    {
        text: '1 hour',
        value: '3600',
    },
    {
        text: '45 minutes',
        value: '2700',
    },
    {
        text: '30 minutes',
        value: '1800',
    },
    {
        text: '15 minutes',
        value: '900',
    },
] as const;

export const ORDER_TIME_INFO_MESSAGE = 'Orders will expire if they aren’t completed within this time.';
