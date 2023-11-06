import React from 'react';
import { useHistory } from 'react-router-dom';
import { WalletButton, WalletText } from '../../../../components';
import BackArrow from '../../../../public/images/ic-back-arrow.svg';
import { fiatOnRampProvider } from './FiatOnRamp.constants';
import OnRampProviderCard from './FiatOnRampProviderCard/FiatOnRampProviderCard';
import './FiatOnRamp.scss';

const FiatOnRamp = () => {
    const history = useHistory();

    return (
        <div className='wallets-fiat-onramp'>
            <WalletButton
                color='white'
                icon={<BackArrow />}
                onClick={() => history.push('/wallets/cashier/deposit')}
                text='Back'
            />
            <div className='wallets-fiat-onramp__content'>
                <div className='wallets-fiat-onramp__description'>
                    <WalletText align='center' color='primary' size='xs'>
                        Fiat onramp is a cashier service that allows you to convert fiat currencies to crypto to top up
                        your Deriv crypto accounts. Listed here are third-party crypto exchanges. You’ll need to create
                        an account with them to use their services.
                    </WalletText>
                </div>
                <OnRampProviderCard
                    description={fiatOnRampProvider.description}
                    getPaymentIcons={fiatOnRampProvider.getPaymentIcons}
                    icon={fiatOnRampProvider.icon}
                    name={fiatOnRampProvider.name}
                />
            </div>
        </div>
    );
};

export default FiatOnRamp;
