import React, { useEffect } from 'react';
import { useTradingPlatformPasswordReset } from '@deriv/api';
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
    onChange: WalletPasswordFieldProps['onChange'];
    password: WalletPasswordFieldProps['password'];
    platform: Exclude<TPlatforms.All, 'ctrader'>;
    verificationCode: string;
};

const WalletsResetMT5Password = ({ onChange, password, platform, verificationCode }: WalletsResetMT5PasswordProps) => {
    const { title } = PlatformDetails[platform];
    const { mutate, status } = useTradingPlatformPasswordReset();
    const { hide, show } = useModal();
    const { isDesktop, isMobile } = useDevice();

    const handleSubmit = () => {
        mutate({
            new_password: password,
            platform,
            verification_code: verificationCode,
        });
    };

    useEffect(() => {
        if (status === 'success') {
            localStorage.removeItem(`verification_code.trading_platform_${platform}_password_reset`); // TODO:Remove verification code from local storage
            show(<WalletSuccessResetMT5Password title={title} />);
        } else if (status === 'error') {
            hide();
        }
    }, [hide, platform, title, show, status]);

    const renderFooter = () => {
        return isMobile ? (
            <WalletButtonGroup isFullWidth>
                <WalletButton onClick={() => hide()} size='lg' text='Cancel' variant='outlined' />
                <WalletButton
                    disabled={!validPassword(password)}
                    isLoading={status === 'loading'}
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
                <WalletText weight='bold'>Create a new {title} Password</WalletText>
                <WalletPasswordField label={`${title} password`} onChange={onChange} password={password} />
                <WalletText size='sm'>
                    Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers,
                    and symbols.
                </WalletText>
                {isDesktop && (
                    <div className='wallets-reset-mt5-password__button-group'>
                        <WalletButton onClick={() => hide()} text='Cancel' variant='outlined' />
                        <WalletButton
                            disabled={!validPassword(password)}
                            isLoading={status === 'loading'}
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
