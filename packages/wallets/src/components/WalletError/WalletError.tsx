import React, { ComponentProps } from 'react';
import { LegacyWarningIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Button } from '@deriv-com/ui';
import useDevice from '../../hooks/useDevice';
import { ModalStepWrapper } from '../Base';
import WalletButton from '../Base/WalletButton/WalletButton';
import './WalletError.scss';

type TProps = {
    buttonText?: string;
    buttonVariant?: ComponentProps<typeof WalletButton>['variant'];
    errorMessage: string;
    onClick?: () => void;
    title?: string;
};

const WalletError: React.FC<TProps> = ({ buttonText, buttonVariant = 'contained', errorMessage, onClick, title }) => {
    const { isDesktop, isMobile } = useDevice();

    return (
        <ModalStepWrapper shouldHideHeader={isDesktop}>
            <div className='wallets-error'>
                <ActionScreen
                    actionButtons={
                        <Button isFullWidth={isMobile} onClick={onClick} size='lg' variant={buttonVariant}>
                            {buttonText ?? <Localize i18n_default_text='Try again' />}
                        </Button>
                    }
                    description={errorMessage}
                    icon={<LegacyWarningIcon fill='#FF444F' iconSize='2xl' />}
                    title={title}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletError;
