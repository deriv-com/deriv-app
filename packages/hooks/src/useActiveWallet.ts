import useWalletsList from './useWalletsList';

/** A custom hook that returns the wallet object for the current active wallet. */
const useActiveWallet = () => {
    const { data: wallet_list } = useWalletsList();
    const active_wallet = wallet_list?.find(wallet => wallet.is_selected);

    return active_wallet;
};

export default useActiveWallet;
