import React, { useEffect } from 'react';
import { useTradingPlatformInvestorPasswordReset, useTradingPlatformPasswordReset } from '@deriv/api';
import { PlatformDetails } from '../../features/cfd/constants';
import useDevice from '../../hooks/useDevice';
import { TPlatforms } from '../../types';
import { validPassword } from '../../utils/passwordUtils';
import { ModalStepWrapper, WalletButton, WalletButtonGroup, WalletPasswordField, WalletText } from '../Base';
import { WalletPasswordFieldProps } from '../Base/WalletPasswordField/WalletPasswordField';
import { useModal } from '../ModalProvider';
import WalletSuccessResetMT5Password from './WalletSuccessResetMT5Password';
import './WalletsResetMT5Password.scss';

type WalletsResetMT5PasswordProps = {
    actionParams: string;
    isInvestorPassword?: boolean;
    onChange: WalletPasswordFieldProps['onChange'];
    password: WalletPasswordFieldProps['password'];
    platform: Exclude<TPlatforms.All, 'ctrader'>;
    verificationCode: string;
};

const WalletsResetMT5Password = ({
    actionParams,
    isInvestorPassword = false,
    onChange,
    password,
    platform,
    verificationCode,
}: WalletsResetMT5PasswordProps) => {
    const { title } = PlatformDetails[platform];
    const {
        isError: isChangePasswordError,
        isLoading: isChangePasswordLoading,
        isSuccess: isChangePasswordSuccess,
        mutate: changePassword,
    } = useTradingPlatformPasswordReset();
    const {
        isError: isChangeInvestorPasswordError,
        isLoading: isChangeInvestorPasswordLoading,
        isSuccess: isChangeInvestorPasswordSuccess,
        mutate: changeInvestorPassword,
    } = useTradingPlatformInvestorPasswordReset();

    const { hide, show } = useModal();
    const { isDesktop, isMobile } = useDevice();

    const handleSubmit = () => {
        if (isInvestorPassword) {
            const accountId = localStorage.getItem('trading_platform_investor_password_reset_account_id') ?? '';
            changeInvestorPassword({
                account_id: accountId,
                new_password: password,
                platform: 'mt5',
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
            show(<WalletSuccessResetMT5Password title={title} />);
        } else if (isChangePasswordError) {
            hide();
        }
    }, [hide, platform, title, show, actionParams, isChangePasswordSuccess, isChangePasswordError]);

    useEffect(() => {
        if (isChangeInvestorPasswordSuccess) {
            localStorage.removeItem(`verification_code.${actionParams}`); // TODO:Remove verification code from local storage
            show(<WalletSuccessResetMT5Password isInvestorPassword title={title} />);
        } else if (isChangeInvestorPasswordError) {
            hide();
        }
    }, [hide, platform, title, show, actionParams, isChangeInvestorPasswordSuccess, isChangeInvestorPasswordError]);

    const renderFooter = () => {
        return isMobile ? (
            <WalletButtonGroup isFullWidth>
                <WalletButton onClick={() => hide()} size='lg' text='Cancel' variant='outlined' />
                <WalletButton
                    disabled={!validPassword(password)}
                    isLoading={isChangeInvestorPasswordLoading || isChangePasswordLoading}
                    onClick={handleSubmit}
                    size='lg'
                    text='Create'
                    variant='contained'
                />
            </WalletButtonGroup>
        ) : null;
    };

    return (
        <ModalStepWrapper
            renderFooter={renderFooter}
            shouldHideFooter={isDesktop}
            shouldHideHeader={isDesktop}
            title={`Manage ${title} password`}
        >
            <div className='wallets-reset-mt5-password'>
                <WalletText weight='bold'>
                    Create a new {title} {isInvestorPassword && 'investor'} Password
                </WalletText>
                <WalletPasswordField
                    label={isInvestorPassword ? 'New investor password' : `${title} password`}
                    onChange={onChange}
                    password={password}
                />
                {!isInvestorPassword && (
                    <WalletText size='sm'>
                        Strong passwords contain at least 8 characters, combine uppercase and lowercase letters,
                        numbers, and symbols.
                    </WalletText>
                )}
                {isDesktop && (
                    <div className='wallets-reset-mt5-password__button-group'>
                        <WalletButton onClick={() => hide()} text='Cancel' variant='outlined' />
                        <WalletButton
                            disabled={!validPassword(password)}
                            isLoading={isChangeInvestorPasswordLoading || isChangePasswordLoading}
                            onClick={handleSubmit}
                            text='Create'
                            variant='contained'
                        />
                    </div>
                )}
            </div>
        </ModalStepWrapper>
    );
};

export default WalletsResetMT5Password;
