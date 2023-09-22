import React, { useEffect } from 'react';
import {
    useActiveWalletAccount,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useSortedMT5Accounts,
} from '@deriv/api';
import MT5PasswordIcon from '../../public/images/ic-mt5-password.svg';
import { CreatePassword } from '../CreatePassword';
import { EnterPassword } from '../EnterPassword';
import { useModal } from '../ModalProvider';
import { WalletModal } from '../WalletModal';

type TProps = {
    marketType: Exclude<NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number]['market_type'], undefined>;
};

const MT5PasswordModal: React.FC<TProps> = ({ marketType }) => {
    const [password, setPassword] = React.useState('');
    const { isSuccess, mutate } = useCreateMT5Account();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: settings } = useSettings();
    const { hide } = useModal();

    const hasMT5Account = mt5Accounts?.find(account => account.login);

    const onSubmit = () => {
        const accountType = marketType === 'synthetic' ? 'gaming' : marketType;

        mutate({
            payload: {
                account_type: activeWallet?.is_virtual ? 'demo' : accountType,
                email: settings?.email || '',
                leverage: 1000,
                mainPassword: password,
                name: settings?.first_name || '',
            },
        });
    };

    useEffect(() => {
        // Success modal here
        if (isSuccess) hide();
    }, [hide, isSuccess]);

    if (hasMT5Account) {
        return (
            <WalletModal>
                <EnterPassword
                    marketType={marketType}
                    onPasswordChange={e => setPassword(e.target.value)}
                    onPrimaryClick={onSubmit}
                    platform='mt5'
                />
            </WalletModal>
        );
    }

    return (
        <WalletModal>
            <CreatePassword
                icon={<MT5PasswordIcon />}
                onPasswordChange={e => setPassword(e.target.value)}
                onPrimaryClick={onSubmit}
                platform='mt5'
            />
        </WalletModal>
    );
};

export default MT5PasswordModal;
