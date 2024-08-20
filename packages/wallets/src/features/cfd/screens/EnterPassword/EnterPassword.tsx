import React, { useEffect } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { WalletButton, WalletPasswordFieldLazy } from '../../../../components/Base';
import { TMarketTypes, TPlatforms } from '../../../../types';
import { validPassword } from '../../../../utils/password-validation';
import { CFD_PLATFORMS, getMarketTypeDetails, PlatformDetails } from '../../constants';
import './EnterPassword.scss';

type TProps = {
    isForgotPasswordLoading?: boolean;
    isLoading?: boolean;
    marketType: TMarketTypes.CreateOtherCFDAccount;
    modalTitle?: string;
    onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
    password: string;
    passwordError?: boolean;
    platform: TPlatforms.All;
    setPassword: (value: string) => void;
};

const EnterPassword: React.FC<TProps> = ({
    isForgotPasswordLoading,
    isLoading,
    marketType,
    modalTitle,
    onPasswordChange,
    onPrimaryClick,
    onSecondaryClick,
    password,
    passwordError,
    platform,
    setPassword,
}) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const { data } = useActiveWalletAccount();

    const accountType = data?.is_virtual ? localize('Demo') : localize('Real');
    const title = PlatformDetails[platform].title;
    const marketTypeTitle =
        platform === PlatformDetails.dxtrade.platform ? accountType : getMarketTypeDetails()[marketType].title;
    const passwordErrorHints = localize(
        'Hint: You may have entered your Deriv password, which is different from your {{title}} password.',
        { title }
    );

    useEffect(() => {
        if (passwordError) {
            setPassword('');
        }
    }, [passwordError, setPassword]);

    return (
        <div className='wallets-enter-password'>
            <div className='wallets-enter-password__container'>
                {isDesktop && (
                    <Text lineHeight='xl' weight='bold'>
                        {modalTitle}
                    </Text>
                )}
                <div className='wallets-enter-password__content'>
                    <Text size='sm'>
                        <Localize
                            i18n_default_text='Enter your {{title}} password to add a {{accountTitle}} {{marketTypeTitle}} account'
                            values={{
                                accountTitle:
                                    platform === CFD_PLATFORMS.MT5 && accountType === 'Demo'
                                        ? `${accountType.toLocaleLowerCase()} ${CFD_PLATFORMS.MT5.toLocaleUpperCase()}`
                                        : title,
                                marketTypeTitle,
                                title,
                            }}
                        />
                    </Text>
                    <WalletPasswordFieldLazy
                        label={localize('{{title}} password', { title })}
                        onChange={onPasswordChange}
                        password={password}
                        passwordError={passwordError}
                        shouldDisablePasswordMeter
                    />
                    {passwordError && <Text size='sm'>{passwordErrorHints}</Text>}
                </div>
            </div>
            {isDesktop && (
                <div className='wallets-enter-password__buttons'>
                    <WalletButton
                        isLoading={isForgotPasswordLoading}
                        onClick={onSecondaryClick}
                        size='md'
                        variant='outlined'
                    >
                        <Localize i18n_default_text='Forgot password?' />
                    </WalletButton>
                    <WalletButton
                        disabled={isLoading || !validPassword(password)}
                        isLoading={isLoading}
                        onClick={onPrimaryClick}
                        size='md'
                    >
                        <Localize i18n_default_text='Add account' />
                    </WalletButton>
                </div>
            )}
        </div>
    );
};

export default EnterPassword;
