import React, { FC } from 'react';
import useDevice from '../../hooks/useDevice';
import MT5SuccessPasswordReset from '../../public/images/mt5-success-password-reset.svg';
import { ModalStepWrapper, WalletButton } from '../Base';
import { useModal } from '../ModalProvider';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './WalletsResetMT5Password.scss';

type WalletSuccessResetMT5PasswordProps = {
    title: string;
};

const WalletSuccessResetMT5Password: FC<WalletSuccessResetMT5PasswordProps> = ({ title }) => {
    const { hide } = useModal();
    const { isDesktop, isMobile } = useDevice();

    return (
        <ModalStepWrapper
            renderFooter={() => isMobile && <WalletButton isFullWidth onClick={() => hide()} size='lg' text='Done' />}
            shouldHideFooter={isDesktop}
            title={`Manage ${title} password`}
        >
            <div className='wallets-reset-popup'>
                <WalletsActionScreen
                    description={`You have a new ${title} password to log in to your ${title} accounts on the web and mobile apps.`}
                    descriptionSize='sm'
                    icon={<MT5SuccessPasswordReset />}
                    renderButtons={() =>
                        isDesktop ? <WalletButton onClick={() => hide()} size='lg' text='Done' /> : undefined
                    }
                    title='Success'
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletSuccessResetMT5Password;
