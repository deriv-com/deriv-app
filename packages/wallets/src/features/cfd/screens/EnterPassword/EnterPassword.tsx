import React, { useEffect, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { WalletButton, WalletPasswordFieldLazy, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import { THooks, TMarketTypes, TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/password-validation';
import { CFDPasswordModalTnc } from '../../components/CFDPasswordModalTnc';
import { CFD_PLATFORMS, getMarketTypeDetails, PlatformDetails, PRODUCT } from '../../constants';
import './EnterPassword.scss';

type TProps = {
    isForgotPasswordLoading?: boolean;
    isLoading?: boolean;
    isVirtual?: boolean;
    marketType: TMarketTypes.CreateOtherCFDAccount;
    modalTitle?: string;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    password: string;
    passwordError?: boolean;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
    setPassword: (value: string) => void;
};

const EnterPassword: React.FC<TProps> = ({
    isForgotPasswordLoading,
    isLoading,
    isVirtual,
    marketType,
    modalTitle,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    password,
    passwordError,
    platform,
    product,
    setPassword,
}) => {
    const { isDesktop } = useDevice();
    const { data } = useActiveWalletAccount();
    const accountType = data?.is_virtual ? 'Demo' : 'Real';
    const title = PlatformDetails[platform].title;
    const marketTypeTitle =
        platform === PlatformDetails.dxtrade.platform ? accountType : getMarketTypeDetails(product)[marketType].title;
    const passwordErrorHints = `Hint: You may have entered your Deriv password, which is different from your ${title} password.`;
    const [checked, setChecked] = useState(!(product === PRODUCT.ZEROSPREAD && !isVirtual));

    useEffect(() => {
        if (passwordError) {
            setPassword('');
        }
    }, [passwordError, setPassword]);

    return (
        <div className='wallets-enter-password'>
            {isDesktop && (
                <WalletText lineHeight='xl' weight='bold'>
                    {modalTitle}
                </WalletText>
            )}
            <div className='wallets-enter-password__content'>
                <WalletText size={isDesktop ? 'sm' : 'md'}>
                    Enter your {title} password to add a{' '}
                    {platform === CFD_PLATFORMS.MT5 && accountType === 'Demo'
                        ? `${accountType.toLocaleLowerCase()} ${CFD_PLATFORMS.MT5.toLocaleUpperCase()}`
                        : title}{' '}
                    {marketTypeTitle} account.
                </WalletText>
                <WalletPasswordFieldLazy
                    label={`${title} password`}
                    onChange={onPasswordChange}
                    password={password}
                    passwordError={passwordError}
                    shouldDisablePasswordMeter
                />
                {passwordError && <WalletText size={isDesktop ? 'sm' : 'md'}>{passwordErrorHints}</WalletText>}
                {product === PRODUCT.ZEROSPREAD && !isVirtual && (
                    <CFDPasswordModalTnc
                        checked={checked}
                        onChange={() => setChecked(prev => !prev)}
                        platform={platform}
                        product={product}
                    />
                )}
            </div>
            {isDesktop && (
                <div className='wallets-enter-password__buttons'>
                    <WalletButton
                        isLoading={isForgotPasswordLoading}
                        onClick={onSecondaryClick}
                        size='lg'
                        variant='outlined'
                    >
                        Forgot password?
                    </WalletButton>
                    <WalletButton
                        disabled={isLoading || !validPassword(password)}
                        isLoading={isLoading}
                        onClick={onPrimaryClick}
                        size='lg'
                    >
                        Add account
                    </WalletButton>
                </div>
            )}
        </div>
    );
};

export default EnterPassword;
