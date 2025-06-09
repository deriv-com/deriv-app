import React from 'react';
import Cookies from 'js-cookie';
import { useSettings } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { derivUrls, OUT_SYSTEMS_TRADERSHUB } from '../../helpers/urls';
import DerivLightUpgradeWalletsOutsystems from '../../public/images/ic_upgrade_wallets_outsystems.svg';
import { ModalWrapper } from '../Base';
import './WalletsOutsystemsMigrationModal.scss';

const WalletsOustystemsMigrationModal = () => {
    const { isMobile } = useDevice();
    const { update } = useSettings();

    const redirectToOutsystems = () => {
        const redirectUrl =
            process.env.NODE_ENV === 'production' ? OUT_SYSTEMS_TRADERSHUB.PRODUCTION : OUT_SYSTEMS_TRADERSHUB.STAGING;

        localStorage.removeItem('redirect_to_th_os');
        const domain = /deriv\.(com|me|be)/.test(window.location.hostname)
            ? derivUrls.DERIV_HOST_NAME
            : window.location.hostname;
        Cookies.set('wallet_account', 'true', { domain });
        update({ feature_flag: { wallet: 1 } });

        const urlQueryString = window.location.search;
        const urlParams = new URLSearchParams(urlQueryString);
        const accountCurrency = urlParams.get('account') || window.sessionStorage.getItem('account');

        window.location.href = `${redirectUrl}/redirect?action=redirect_to&redirect_to=home${accountCurrency ? `&account=${accountCurrency}` : ''}`;
    };

    return (
        <ModalWrapper hideCloseButton isFullscreen={isMobile} shouldPreventCloseOnEscape>
            <div className='wallets-outsystems-migration-modal'>
                <div className='wallets-outsystems-migration-modal__content'>
                    <DerivLightUpgradeWalletsOutsystems height={150} width={210} />
                    <div className='wallets-outsystems-migration-modal__body'>
                        <Text align='center' size={isMobile ? 'xl' : 'md'} weight='bold'>
                            <Localize i18n_default_text="Meet the new Trader's Hub" />
                        </Text>
                        <Text align='center' size={isMobile ? 'lg' : 'sm'}>
                            <Localize i18n_default_text='Faster to use, easier navigation, better account management, same login details.' />
                        </Text>
                    </div>
                </div>
                <div
                    className={
                        isMobile
                            ? 'wallets-outsystems-migration-modal__footer-mobile'
                            : 'wallets-outsystems-migration-modal__footer'
                    }
                >
                    <Button isFullWidth onClick={redirectToOutsystems} rounded='lg' size='lg' textSize='md'>
                        <Localize i18n_default_text='Try it now' />
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default WalletsOustystemsMigrationModal;
