import React, { useEffect, useState } from 'react';
import { useTradingPlatformInvestorPasswordReset, useTradingPlatformPasswordReset } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { CFD_PLATFORMS, PlatformDetails } from '../../features/cfd/constants';
import useDevice from '../../hooks/useDevice';
import { TPlatforms } from '../../types';
import { validPassword, validPasswordMT5 } from '../../utils/password-validation';
import { ModalStepWrapper, WalletButton, WalletPasswordFieldLazy } from '../Base';
import { useModal } from '../ModalProvider';
import { WalletError } from '../WalletError';
import WalletsErrorMT5InvestorPassword from './WalletsErrorMT5InvestorPassword';
import WalletSuccessResetMT5Password from './WalletSuccessResetMT5Password';
import './WalletsResetMT5Password.scss';

const modalDescription = {
    [CFD_PLATFORMS.DXTRADE]: (
        <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
    ),
    [CFD_PLATFORMS.MT5]: (
        <Localize i18n_default_text='Password must have at least one of these special characters: !&‘’*-“%+.#&(),:;?=@<>\[]^_{}|~' />
    ),
} as const;

type WalletsResetMT5PasswordProps = {
    actionParams: string;
    isInvestorPassword?: boolean;
    platform: Exclude<TPlatforms.All, 'ctrader'>;
    verificationCode: string;
};

const WalletsResetMT5Password = ({
    actionParams,
    isInvestorPassword = false,
    platform,
    verificationCode,
}: WalletsResetMT5PasswordProps) => {
    const { isMobile } = useDevice();
    const { title } = isInvestorPassword ? PlatformDetails.mt5Investor : PlatformDetails[platform];
    const {
        error: changePasswordError,
        isError: isChangePasswordError,
        isLoading: isChangePasswordLoading,
        isSuccess: isChangePasswordSuccess,
        mutate: changePassword,
    } = useTradingPlatformPasswordReset();
    const {
        error: changeInvestorPasswordError,
        isError: isChangeInvestorPasswordError,
        isLoading: isChangeInvestorPasswordLoading,
        isSuccess: isChangeInvestorPasswordSuccess,
        mutate: changeInvestorPassword,
    } = useTradingPlatformInvestorPasswordReset();

    const { hide, show } = useModal();
    const { localize } = useTranslations();
    const [password, setPassword] = useState('');

    const isMT5 = platform === CFD_PLATFORMS.MT5;

    const handleSubmit = () => {
        if (isInvestorPassword && isMT5) {
            const accountId = localStorage.getItem('trading_platform_investor_password_reset_account_id') ?? '';
            changeInvestorPassword({
                account_id: accountId,
                new_password: password,
                platform: CFD_PLATFORMS.MT5,
                verification_code: verificationCode,
            });
        } else {
            changePassword({
                new_password: password,
                platform,
                verification_code: verificationCode,
            });
        }
    };

    useEffect(() => {
        if (isChangePasswordSuccess) {
            localStorage.removeItem(`verification_code.${actionParams}`); // TODO:Remove verification code from local storage
            show(<WalletSuccessResetMT5Password onClick={hide} title={title} />, {
                defaultRootId: 'wallets_modal_root',
            });
        } else if (isChangePasswordError) {
            show(
                <WalletError
                    errorMessage={changePasswordError?.error?.message}
                    onClick={hide}
                    title={changePasswordError?.error?.code}
                />
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [platform, title, actionParams, isChangePasswordSuccess, isChangePasswordError]);

    useEffect(() => {
        if (isChangeInvestorPasswordSuccess) {
            localStorage.removeItem(`verification_code.${actionParams}`); // TODO:Remove verification code from local storage
            show(<WalletSuccessResetMT5Password isInvestorPassword onClick={hide} title={title} />, {
                defaultRootId: 'wallets_modal_root',
            });
        } else if (isChangeInvestorPasswordError) {
            show(
                <WalletsErrorMT5InvestorPassword
                    errorMessage={changeInvestorPasswordError?.error?.message}
                    renderButtons={() => (
                        <WalletButton isFullWidth={isMobile} onClick={hide}>
                            <Localize i18n_default_text='Ok' />
                        </WalletButton>
                    )}
                    title={title}
                />
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [platform, title, actionParams, isChangeInvestorPasswordSuccess, isChangeInvestorPasswordError]);

    const renderButtons = () => (
        <div className={'wallets-reset-mt5-password__footer'}>
            <WalletButton isFullWidth={isMobile} onClick={() => hide()} size='lg' variant='outlined'>
                <Localize i18n_default_text='Cancel' />
            </WalletButton>
            <WalletButton
                disabled={isMT5 ? !validPasswordMT5(password) : !validPassword(password)}
                isFullWidth={isMobile}
                isLoading={isChangeInvestorPasswordLoading || isChangePasswordLoading}
                onClick={handleSubmit}
                size='lg'
                variant='contained'
            >
                <Localize i18n_default_text='Create' />
            </WalletButton>
        </div>
    );

    return (
        <ModalStepWrapper
            renderFooter={isMobile ? renderButtons : undefined}
            shouldHideFooter={!isMobile}
            shouldHideHeader={!isMobile}
            title={localize('Manage {{title}} password', { localize })}
        >
            <div className='wallets-reset-mt5-password'>
                <Text align={isMobile ? 'center' : 'left'} weight='bold'>
                    <Localize i18n_default_text='Create a new {{title}} password' values={{ title }} />
                </Text>
                {isMT5 && !isInvestorPassword && (
                    <Text size='sm'>
                        <Localize
                            i18n_default_text='You can use this password for all your {{title}} accounts.'
                            values={{ title }}
                        />
                    </Text>
                )}
                <WalletPasswordFieldLazy
                    label={
                        isInvestorPassword
                            ? localize('New investor password')
                            : localize('{{title}} password', { title })
                    }
                    mt5Policy={isMT5}
                    onChange={e => setPassword(e.target.value)}
                    password={password}
                />
                <Text size='sm'>{modalDescription[platform]}</Text>
                {!isMobile && renderButtons()}
            </div>
        </ModalStepWrapper>
    );
};

export default WalletsResetMT5Password;
