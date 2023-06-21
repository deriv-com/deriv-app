import useWalletList from './useWalletsList';

const useActiveWallet = () => {
    const { data: wallet_list } = useWalletList();
    const active_wallet = wallet_list?.find(wallet => wallet.is_selected);

    return active_wallet;
};

export default useActiveWallet;
