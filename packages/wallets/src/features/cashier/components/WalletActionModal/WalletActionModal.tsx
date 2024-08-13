import React from 'react';
import { Button } from '@deriv-com/ui';
import { ModalWrapper, WalletText } from '../../../../components/Base';
import useDevice from '../../../../hooks/useDevice';
import './WalletActionModal.scss';

type TWalletActionModal = {
    actionButtonsOptions: {
        isPrimary?: boolean;
        onClick: VoidFunction;
        text: string;
    }[];
    description?: JSX.Element | string;
    hideCloseButton?: React.ComponentProps<typeof ModalWrapper>['hideCloseButton'];
    title: string;
};

const WalletActionModal: React.FC<TWalletActionModal> = ({
    actionButtonsOptions,
    description,
    hideCloseButton = false,
    title,
}) => {
    const { isMobile } = useDevice();

    return (
        <ModalWrapper hideCloseButton={hideCloseButton}>
            <div className='wallets-action-modal'>
                <WalletText lineHeight={isMobile ? 'md' : 'xl'} weight='bold'>
                    {title}
                </WalletText>
                <WalletText lineHeight={isMobile ? 'sm' : 'lg'} size='sm'>
                    {description}
                </WalletText>
                {!!actionButtonsOptions.length && (
                    <div className='wallets-action-modal__buttons-container'>
                        {actionButtonsOptions.map(action => (
                            <Button
                                borderWidth='sm'
                                color={action.isPrimary ? 'primary' : 'black'}
                                key={action.text}
                                onClick={action.onClick}
                                size='lg'
                                textSize='md'
                                variant={action.isPrimary ? 'contained' : 'outlined'}
                            >
                                {action.text}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </ModalWrapper>
    );
};

export default WalletActionModal;
