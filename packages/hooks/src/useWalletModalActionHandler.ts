import { useStore } from '@deriv/stores';

const useWalletModalActionHandler = () => {
    const { traders_hub } = useStore();

    const { setWalletModalActiveTabIndex } = traders_hub;

    const handleAction = (name: string) => {
        const actionMap = { Deposit: 0, Withdraw: 1, Transfer: 2, Transactions: 3 };
        const tabIndex = actionMap[name as keyof typeof actionMap];

        if (tabIndex !== undefined) setWalletModalActiveTabIndex(tabIndex);
    };

    return { setWalletModalActiveTabIndex, handleAction };
};

export default useWalletModalActionHandler;
