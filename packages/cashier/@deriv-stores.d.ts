import type { TStores } from '@deriv/stores';
import type CashierStore from './src/stores/cashier-store';
import type TNotificationStore from './src/stores/notification-store.types';

declare module '@deriv/stores' {
    export function useStore(): TStores & {
        // TODO: Remove `notifications` when remove connect method from p2p page
        notifications: TNotificationStore;
        modules: {
            cashier: CashierStore;
        };
    };
}
