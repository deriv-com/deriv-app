import React, { ComponentProps, FC } from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup } from '../../../../components';
import { PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';

type TProps = Omit<ComponentProps<typeof CFDSuccess>, 'title'> & {
    isDemo?: boolean;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
};

const SuccessModal: FC<TProps> = ({
    description,
    displayBalance = '',
    isDemo,
    marketType = 'all',
    onPrimaryClick,
    onSecondaryClick,
    platform = 'dxtrade',
}) => {
    const { isDesktop } = useDevice();

    const buttonSize = isDesktop ? 'md' : 'lg';

    const renderButton = isDemo ? (
        <div className='wallets-success-btn'>
            <Button isFullWidth onClick={onSecondaryClick} size={buttonSize} textSize='sm'>
                <Localize i18n_default_text='OK' />
            </Button>
        </div>
    ) : (
        <WalletButtonGroup isFlex isFullWidth>
            <Button
                borderWidth='sm'
                color='black'
                onClick={onSecondaryClick}
                size={buttonSize}
                textSize='sm'
                variant='outlined'
            >
                <Localize i18n_default_text='Maybe later' />
            </Button>
            <Button onClick={onPrimaryClick} size={buttonSize} textSize='sm'>
                <Localize i18n_default_text='Transfer funds' />
            </Button>
        </WalletButtonGroup>
    );

    if (isDesktop) {
        return (
            <ModalWrapper hideCloseButton>
                <CFDSuccess
                    actionButtons={renderButton}
                    description={description}
                    displayBalance={displayBalance}
                    marketType={marketType}
                    platform={platform}
                    title={
                        isDemo ? (
                            <Localize
                                i18n_default_text='Your {{platformTitle}} demo account is ready'
                                values={{ platformTitle: PlatformDetails[platform].title }}
                            />
                        ) : (
                            <Localize
                                i18n_default_text='Your {{platformTitle}} account is ready'
                                values={{ platformTitle: PlatformDetails[platform].title }}
                            />
                        )
                    }
                />
            </ModalWrapper>
        );
    }

    return (
        <ModalStepWrapper renderFooter={() => renderButton} title={' '}>
            <CFDSuccess
                actionButtons={renderButton}
                description={description}
                displayBalance={displayBalance}
                marketType={marketType}
                platform={platform}
                title={
                    isDemo ? (
                        <Localize
                            i18n_default_text='Your {{platformTitle}} demo account is ready'
                            values={{ platformTitle: PlatformDetails[platform].title }}
                        />
                    ) : (
                        <Localize
                            i18n_default_text='Your {{platformTitle}} account is ready'
                            values={{ platformTitle: PlatformDetails[platform].title }}
                        />
                    )
                }
            />
        </ModalStepWrapper>
    );
};

export default SuccessModal;
