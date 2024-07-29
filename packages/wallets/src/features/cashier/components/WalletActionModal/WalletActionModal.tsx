import React from 'react';
import { Button, useDevice } from '@deriv-com/ui';
import { ModalWrapper, WalletText } from '../../../../components/Base';
import './WalletActionModal.scss';

type TWalletActionModal = {
    actionButtonsOptions: {
        isPrimary?: boolean;
        onClick: VoidFunction;
        text: string;
    }[];
    description?: string;
    hideCloseButton?: React.ComponentProps<typeof ModalWrapper>['hideCloseButton'];
    title: string;
};

const WalletActionModal: React.FC<TWalletActionModal> = ({
    actionButtonsOptions,
    description,
    hideCloseButton = false,
    title,
}) => {
    const { isDesktop } = useDevice();

    return (
        <ModalWrapper hideCloseButton={hideCloseButton}>
            <div className='wallets-action-modal'>
                <WalletText lineHeight={isDesktop ? 'xl' : 'md'} weight='bold'>
                    {title}
                </WalletText>
                <WalletText lineHeight={isDesktop ? 'lg' : 'sm'} size='sm'>
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
