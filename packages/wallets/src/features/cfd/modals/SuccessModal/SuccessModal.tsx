import React, { ComponentProps, FC } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
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
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    const { data: activeWallet } = useActiveWalletAccount();

    const accountType = activeWallet?.is_virtual ? localize('demo') : 'real';

    const renderButton =
        accountType === 'demo' ? (
            <div className='wallets-success-btn'>
                <WalletButton isFullWidth onClick={onSecondaryClick} size={isMobile ? 'lg' : 'md'}>
                    <Localize i18n_default_text='OK' />
                </WalletButton>
            </div>
        ) : (
            <WalletButtonGroup isFlex isFullWidth>
                <WalletButton onClick={onSecondaryClick} size={isMobile ? 'lg' : 'md'} variant='outlined'>
                    <Localize i18n_default_text='Maybe later' />
                </WalletButton>
                <WalletButton onClick={onPrimaryClick} size={isMobile ? 'lg' : 'md'}>
                    <Localize i18n_default_text='Transfer funds' />
                </WalletButton>
            </WalletButtonGroup>
        );

    if (isMobile) {
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
