import React, { ComponentProps, FC } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup } from '../../../../components';
import { PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';

type TProps = Omit<ComponentProps<typeof CFDSuccess>, 'title'> & {
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
};

const SuccessModal: FC<TProps> = ({
    description,
    displayBalance = '',
    marketType = 'all',
    onPrimaryClick,
    onSecondaryClick,
    platform = 'dxtrade',
}) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const { data: activeWallet } = useActiveWalletAccount();

    const accountType = activeWallet?.is_virtual ? localize('demo') : 'real';

    const renderButton =
        accountType === 'demo' ? (
            <div className='wallets-success-btn'>
                <Button isFullWidth onClick={onSecondaryClick} size={isDesktop ? 'md' : 'lg'} textSize='sm'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </div>
        ) : (
            <WalletButtonGroup isFlex isFullWidth>
                <Button
                    borderWidth='sm'
                    color='black'
                    onClick={onSecondaryClick}
                    size={isDesktop ? 'md' : 'lg'}
                    textSize='sm'
                    variant='outlined'
                >
                    <Localize i18n_default_text='Maybe later' />
                </Button>
                <Button onClick={onPrimaryClick} size={isDesktop ? 'md' : 'lg'} textSize='sm'>
                    <Localize i18n_default_text='Transfer funds' />
                </Button>
            </WalletButtonGroup>
        );

    if (!isDesktop) {
        return (
            <ModalStepWrapper renderFooter={() => renderButton} title={' '}>
                <CFDSuccess
                    description={description}
                    displayBalance={displayBalance}
                    marketType={marketType}
                    platform={platform}
                    title={
                        <Localize
                            i18n_default_text='Your {{platformTitle}}{{demoTitle}} account is ready'
                            values={{
                                demoTitle: accountType === localize('demo') ? ` ${accountType}` : '',
                                platformTitle: PlatformDetails[platform].title,
                            }}
                        />
                    }
                />
            </ModalStepWrapper>
        );
    }

    return (
        <ModalWrapper hideCloseButton>
            <CFDSuccess
                actionButtons={renderButton}
                description={description}
                displayBalance={displayBalance}
                marketType={marketType}
                platform={platform}
                title={
                    <Localize
                        i18n_default_text='Your {{platformTitle}}{{demoTitle}} account is ready'
                        values={{
                            demoTitle: accountType === localize('demo') ? ` ${accountType}` : '',
                            platformTitle: PlatformDetails[platform].title,
                        }}
                    />
                }
            />
        </ModalWrapper>
    );
};

export default SuccessModal;
