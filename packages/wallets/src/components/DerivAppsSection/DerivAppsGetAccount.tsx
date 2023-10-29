import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount } from '@deriv/api';
import { Success } from '../../features/cfd/screens/Success';
import useDevice from '../../hooks/useDevice';
import DerivApps from '../../public/images/deriv-apps.svg';
import { THooks } from '../../types';
import { ModalStepWrapper, WalletButton, WalletText } from '../Base';
import { useModal } from '../ModalProvider';

type TProps = {
    isMaltaWallet?: THooks.ActiveWalletAccount['is_malta_wallet'];
};

const DerivAppsGetAccount: React.FC<TProps> = ({ isMaltaWallet }) => {
    const { hide, show } = useModal();
    const { isDesktop } = useDevice();
    const { data: activeWallet } = useActiveWalletAccount();
    const history = useHistory();

    const landingCompanyName = activeWallet?.landing_company_name?.toLocaleUpperCase();

    const footer = (
        <div className='wallets-success-modal--footer'>
            <WalletButton isFullWidth={!isDesktop} onClick={hide} size='lg' text='Maybe later' variant='outlined' />
            <WalletButton
                isFullWidth={!isDesktop}
                onClick={() => {
                    history.push('wallets/cashier/transfer');
                    hide();
                }}
                size='lg'
                text='Transfer funds'
            />
        </div>
    );

    const openSuccessModal = () => {
        show(
            <ModalStepWrapper
                renderFooter={isDesktop ? undefined : () => footer}
                shouldFixedFooter={false}
                shouldHideHeader={isDesktop}
            >
                <Success
                    description={`Transfer funds from ${activeWallet?.wallet_currency_type} Wallet to your Deriv Apps (${landingCompanyName}) account to start trading.`}
                    displayBalance={activeWallet?.display_balance}
                    renderButton={() => footer}
                    title={`Your Deriv Apps (${landingCompanyName}) account is ready`}
                />
            </ModalStepWrapper>
        );
    };

    return (
        <div className='wallets-deriv-apps-section'>
            <DerivApps />
            <div className='wallets-deriv-apps-section__details'>
                <WalletText size='sm' weight='bold'>
                    Deriv Apps
                </WalletText>
                <WalletText lineHeight='2xs' size='2xs'>
                    {isMaltaWallet
                        ? 'Get a Deriv Apps trading account regulated by MFSA to trade multipliers on Deriv Trader.'
                        : 'Get a Deriv Apps trading account to trade options and multipliers on these apps.'}
                </WalletText>
            </div>
            <WalletButton color='primary-light' onClick={openSuccessModal} text='Get' />
        </div>
    );
};

export { DerivAppsGetAccount };
