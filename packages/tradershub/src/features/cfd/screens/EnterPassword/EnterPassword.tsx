import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { Button, Text, TextField, useBreakpoint } from '@deriv/quill-design';
import { TMarketTypes, TPlatforms } from '../../../../types';
// import { validPassword } from '../../../../utils/password';
import { MarketTypeDetails, PlatformDetails } from '../../constants';
import './EnterPassword.scss';

type TProps = {
    isLoading?: boolean;
    marketType: TMarketTypes.CreateOtherCFDAccount;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    password: string;
    passwordError?: boolean;
    platform: TPlatforms.All;
};

const EnterPassword: React.FC<TProps> = ({
    isLoading,
    marketType,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    password,
    passwordError,
    platform,
}) => {
    // const { isDesktop } = useBreakpoint();
    const title = PlatformDetails[platform].title;
    const { data } = useActiveWalletAccount();
    const accountType = data?.is_virtual ? 'Demo' : 'Real';
    const marketTypeTitle =
        platform === PlatformDetails.dxtrade.platform ? accountType : MarketTypeDetails[marketType].title;

    return (
        <div className='wallets-enter-password'>
            <div className='wallets-enter-password__container'>
                <Text lineHeight='xl' weight='bold'>
                    Enter your {title} password
                </Text>
                <div className='wallets-enter-password__content'>
                    <Text size='sm'>
                        Enter your {title} password to add a {title} {marketTypeTitle} account.
                    </Text>
                    <TextField
                        onChange={onPasswordChange}
                        placeholder={`${title} password`}
                        status={passwordError ? 'error' : undefined}
                        value={password}
                    />
                </div>
            </div>
            {isDesktop && (
                <div className='wallets-enter-password__buttons'>
                    <Button onClick={onSecondaryClick} size='lg' variant='outlined'>
                        Forgot password?
                    </Button>
                    <Button
                        disabled={!password || isLoading || !validPassword(password) || passwordError}
                        isLoading={isLoading}
                        onClick={onPrimaryClick}
                        size='lg'
                    >
                        Add account
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EnterPassword;
