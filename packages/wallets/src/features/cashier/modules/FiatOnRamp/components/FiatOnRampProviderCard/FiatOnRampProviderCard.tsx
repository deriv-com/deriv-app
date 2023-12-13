import React, { MouseEventHandler } from 'react';
import { WalletButton, WalletText } from '../../../../../../components';
import './FiatOnRampProviderCard.scss';

type TFiatOnRampProvider = {
    description: string;
    getPaymentIcons: () => { icon: JSX.Element; name: string }[];
    handleDisclaimer: MouseEventHandler<HTMLButtonElement>;
    icon: React.ReactNode;
    name: string;
};

const FiatOnRampProviderCard: React.FC<TFiatOnRampProvider> = ({
    description,
    getPaymentIcons,
    handleDisclaimer,
    icon,
    name,
}) => {
    const paymentIcons = getPaymentIcons();

    return (
        <div className='wallets-fiat-onramp-provider'>
            <div className='wallets-fiat-onramp-provider__logo'>{icon}</div>
            <div className='wallets-fiat-onramp-provider__content'>
                <WalletText color='prominent' size='md' weight='bold'>
                    {name}
                </WalletText>
                <WalletText size='sm'>{description}</WalletText>
                <div className='wallets-fiat-onramp-provider__icons'>
                    {paymentIcons.map((paymentIcon, index) => (
                        <div
                            data-testid={`dt_payment-method-icon-${paymentIcon.name}`}
                            key={`payment-method-icon-${index}`}
                        >
                            {paymentIcon.icon}
                        </div>
                    ))}
                </div>
            </div>
            <div className='wallets-fiat-onramp-provider__mobile-icons'>
                {paymentIcons.map((paymentIcon, index) => (
                    <div key={`payment-method-icon-${index}`}>{paymentIcon.icon}</div>
                ))}
            </div>
            <WalletButton onClick={handleDisclaimer} size='md'>
                Select
            </WalletButton>
        </div>
    );
};

export default FiatOnRampProviderCard;
