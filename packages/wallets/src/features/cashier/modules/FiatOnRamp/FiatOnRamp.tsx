import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { WalletButton, WalletText } from '../../../../components';
import BackArrow from '../../../../public/images/ic-back-arrow.svg';
import { FiatOnRampDisclaimer, FiatOnRampProviderCard } from './components';
import { fiatOnRampProvider } from './constants';
import './FiatOnRamp.scss';

const FiatOnRamp = () => {
    const history = useHistory();
    const [disclaimer, setDisclaimer] = useState(false);

    const handleDisclaimer = () => setDisclaimer(disclaimer => !disclaimer);

    return (
        <React.Fragment>
            {disclaimer ? (
                <FiatOnRampDisclaimer handleDisclaimer={handleDisclaimer} />
            ) : (
                <div className='wallets-fiat-onramp'>
                    <div className='wallets-fiat-onramp__actions'>
                        <WalletButton
                            color='white'
                            icon={<BackArrow />}
                            onClick={() => history.push('/wallets/cashier/deposit')}
                            text='Back'
                        />
                    </div>
                    <div className='wallets-fiat-onramp__content'>
                        <div className='wallets-fiat-onramp__description'>
                            <WalletText align='center' color='primary' size='xs'>
                                Fiat onramp is a cashier service that allows you to convert fiat currencies to crypto to
                                top up your Deriv crypto accounts. Listed here are third-party crypto exchanges. You’ll
                                need to create an account with them to use their services.
                            </WalletText>
                        </div>
                        <FiatOnRampProviderCard
                            description={fiatOnRampProvider.description}
                            getPaymentIcons={fiatOnRampProvider.getPaymentIcons}
                            handleDisclaimer={handleDisclaimer}
                            icon={fiatOnRampProvider.icon}
                            name={fiatOnRampProvider.name}
                        />
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default FiatOnRamp;
