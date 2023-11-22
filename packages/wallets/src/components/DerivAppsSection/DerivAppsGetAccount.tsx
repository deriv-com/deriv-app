import React, { useCallback, useEffect } from 'react';
import { useActiveWalletAccount, useCreateNewRealAccount, useSettings } from '@deriv/api';
import { toMoment } from '../../../../shared/src/utils/date';
import { CFDSuccess } from '../../features/cfd/screens/CFDSuccess';
import useDevice from '../../hooks/useDevice';
import DerivApps from '../../public/images/deriv-apps.svg';
import { ModalStepWrapper, WalletButton, WalletText } from '../Base';
import { useModal } from '../ModalProvider';
import { DerivAppsSuccessFooter } from './DerivAppsSuccessFooter';

const DerivAppsGetAccount: React.FC = () => {
    const { show } = useModal();
    const { isDesktop } = useDevice();
    const { data: activeWallet } = useActiveWalletAccount();
    const { isSuccess: isAccountCreationSuccess, mutate: createNewRealAccount } = useCreateNewRealAccount();
    const {
        data: { country_code: countryCode, date_of_birth: dateOfBirth, first_name: firstName, last_name: lastName },
    } = useSettings();

    const landingCompanyName = activeWallet?.landing_company_name?.toLocaleUpperCase();

    const openSuccessModal = useCallback(() => {
        show(
            <ModalStepWrapper
                renderFooter={isDesktop ? undefined : () => <DerivAppsSuccessFooter />}
                shouldHideDerivAppHeader
                shouldHideHeader={isDesktop}
            >
                <CFDSuccess
                    description={`Transfer funds from your ${activeWallet?.wallet_currency_type} Wallet to your Deriv Apps (${landingCompanyName}) account to start trading.`}
                    displayBalance={activeWallet?.display_balance}
                    renderButton={() => <DerivAppsSuccessFooter />}
                    title={`Your Deriv Apps (${landingCompanyName}) account is ready`}
                />
            </ModalStepWrapper>,
            {
                defaultRootId: 'wallets_modal_root',
            }
        );
    }, [activeWallet?.display_balance, activeWallet?.wallet_currency_type, isDesktop, landingCompanyName, show]);

    useEffect(() => {
        if (isAccountCreationSuccess) {
            openSuccessModal();
        }
    }, [isAccountCreationSuccess, openSuccessModal]);

    const createTradingAccount = () => {
        createNewRealAccount({
            payload: {
                currency: activeWallet?.currency_config?.display_code,
                date_of_birth: toMoment(dateOfBirth).format('YYYY-MM-DD'),
                first_name: firstName,
                last_name: lastName,
                residence: countryCode || '',
            },
        });
    };

    return (
        <div className='wallets-deriv-apps-section'>
            <DerivApps />
            <div className='wallets-deriv-apps-section__details'>
                <WalletText size='sm' weight='bold'>
                    Deriv Apps
                </WalletText>
                <WalletText lineHeight='2xs' size='xs'>
                    {activeWallet?.is_malta_wallet
                        ? 'Get a Deriv Apps trading account regulated by MFSA to trade multipliers on Deriv Trader.'
                        : 'Get a Deriv Apps trading account to trade options and multipliers on these apps.'}
                </WalletText>
            </div>
            <WalletButton color='primary-light' onClick={createTradingAccount} text='Get' />
        </div>
    );
};

export { DerivAppsGetAccount };
