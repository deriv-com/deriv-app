import { useStore } from '@deriv/stores';
import useActiveWallet from './useActiveWallet';

const walletHeaderTabsConfig = (is_demo: boolean) =>
    is_demo
        ? ({ Transfer: 0, Transactions: 1, Deposit: 2 } as const)
        : ({ Deposit: 0, Withdraw: 1, Transfer: 2, Transactions: 3 } as const);

const useWalletModalActionHandler = () => {
    const { traders_hub } = useStore();

    const active_wallet = useActiveWallet();

    const is_demo = active_wallet?.is_demo;

    const { setWalletModalActiveTabIndex } = traders_hub;

    const handleAction = (name: string) => {
        const active_tab_index = (walletHeaderTabsConfig(is_demo || false) as Record<string, number>)[name];
        setWalletModalActiveTabIndex(active_tab_index);
    };

    return { setWalletModalActiveTabIndex, handleAction };
};

export default useWalletModalActionHandler;
