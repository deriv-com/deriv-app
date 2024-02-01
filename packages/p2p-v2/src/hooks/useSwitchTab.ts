import { useCallback } from 'react';

/**
 * Hook that returns a function to switch between different tabs in P2P.
 *
 * @returns Function `switchTab` that switches the primary tabs in P2P when invoked with a tab name
 */
export const useSwitchTab = () => {
    const switchTab = useCallback((tab: 'buy-sell' | 'my-ads' | 'my-profile' | 'orders') => {
        dispatchEvent(
            new CustomEvent('switchTab', {
                detail: { tab },
            })
        );
    }, []);
    return switchTab;
};
