import React, { useState } from 'react';
import {
    useActiveWalletAccount,
    useAvailableMT5Accounts,
    useCreateMT5Account,
    useMT5AccountsList,
    useSettings,
    useSortedMT5Accounts,
} from '@deriv/api';
import { ModalWrapper, WalletButton } from '../../../../components/Base';
import { WalletText } from '../../../../components/Base/WalletText';
import MT5PasswordIcon from '../../../../public/images/ic-mt5-password.svg';
import { Success, CreatePassword, EnterPassword } from '../../screens';
import { useModal } from '../../../../components/ModalProvider';

type TProps = {
    marketType: Exclude<NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number]['market_type'], undefined>;
};

const marketTypeToTitleMapper: Record<TProps['marketType'], string> = {
    all: 'Swap-Free',
    financial: 'MT5 Financial',
    synthetic: 'MT5 Derived',
};

const MT5PasswordModal: React.FC<TProps> = ({ marketType }) => {
    const [password, setPassword] = useState('');
    const { isSuccess, mutate } = useCreateMT5Account();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: mt5Accounts } = useMT5AccountsList();
    const { data: availableMT5Accounts } = useAvailableMT5Accounts();
    const { data: settings } = useSettings();
    const { hide } = useModal();

    const hasMT5Account = mt5Accounts?.find(account => account.login);
    const isDemo = activeWallet?.is_virtual;

    const onSubmit = () => {
        const accountType = marketType === 'synthetic' ? 'gaming' : marketType;

        mutate({
            payload: {
                account_type: activeWallet?.is_virtual ? 'demo' : accountType,
                company: 'svg',
                country: settings?.country_code || '',
                email: settings?.email || '',
                leverage: availableMT5Accounts?.find(acc => acc.market_type === marketType)?.leverage || 500,
                mainPassword: password,
                ...(marketType === 'financial' && { mt5_account_type: 'financial' }),
                ...(marketType === 'all' && { sub_account_category: 'swap_free' }),
                name: settings?.first_name || '',
            },
        });
    };

    return (
        <ModalWrapper hideCloseButton={isSuccess}>
            {isSuccess && (
                <Success
                    description={`You can now start practicing trading with your ${
                        marketTypeToTitleMapper[marketType]
                    } ${isDemo ? ' demo' : 'real'} account.`}
                    marketType={marketType}
                    renderButton={() => (
                        <WalletButton onClick={hide}>
                            <WalletText color='white' size='sm' weight='bold'>
                                Continue
                            </WalletText>
                        </WalletButton>
                    )}
                    title={`Your ${marketTypeToTitleMapper[marketType]} ${isDemo ? ' demo' : 'real'} account is ready`}
                />
            )}
            {!isSuccess &&
                (hasMT5Account ? (
                    <EnterPassword
                        marketType={marketType}
                        onPasswordChange={e => setPassword(e.target.value)}
                        onPrimaryClick={onSubmit}
                        platform='mt5'
                    />
                ) : (
                    <CreatePassword
                        icon={<MT5PasswordIcon />}
                        onPasswordChange={e => setPassword(e.target.value)}
                        onPrimaryClick={onSubmit}
                        platform='mt5'
                    />
                ))}
        </ModalWrapper>
    );
};

export default MT5PasswordModal;
