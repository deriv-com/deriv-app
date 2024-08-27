import React, { ComponentProps } from 'react';
import { LegacyWarningIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import useDevice from '../../hooks/useDevice';
import { ModalStepWrapper } from '../Base';
import { WalletsActionScreen } from '../WalletsActionScreen';
import './WalletError.scss';

type TProps = {
    buttonText?: string;
    buttonVariant?: ComponentProps<typeof Button>['variant'];
    errorMessage: string;
    onClick?: () => void;
    title?: string;
};

const WalletError: React.FC<TProps> = ({ buttonText, buttonVariant = 'contained', errorMessage, onClick, title }) => {
    const { isDesktop } = useDevice();

    return (
        <ModalStepWrapper shouldHideHeader={isDesktop}>
            <div className='wallets-error'>
                <WalletsActionScreen
                    description={errorMessage}
                    icon={<LegacyWarningIcon fill='#FF444F' iconSize='2xl' />}
                    renderButtons={() => (
                        <Button
                            isFullWidth={!isDesktop}
                            onClick={onClick}
                            size='lg'
                            textSize='md'
                            variant={buttonVariant}
                        >
                            {buttonText ?? <Localize i18n_default_text='Try again' />}
                        </Button>
                    )}
                    title={title}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default WalletError;
