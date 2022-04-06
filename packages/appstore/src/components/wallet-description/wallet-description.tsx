import React, { useState, useEffect } from 'react';
import { Text } from '@deriv/components';
import wallet_descriptions from './../../constants/wallet-description';

type TWalletDescriptionProps = {
    wallet_name:
        | 'aud'
        | 'eur'
        | 'gbp'
        | 'usd'
        | 'bitcoin'
        | 'ethereum'
        | 'litecoin'
        | 'tether'
        | 'usd_coin'
        | 'deriv_p2p'
        | 'payment_agent';
};

type TWalletDescription = {
    title: string;
    description: string;
    deposit_information: string;
    withdrawal_information: string;
};

const WalletDescription = ({ wallet_name }: TWalletDescriptionProps) => {
    const [wallet_description, setWalletDescription] = useState<TWalletDescription>();

    useEffect(() => {
        setWalletDescription(wallet_descriptions[`${wallet_name}`]);
    }, [wallet_name]);

    return (
        <>
            {wallet_description && (
                <div className='wallet-details'>
                    <div className='wallet-details__title'>
                        <Text as='p' weight='bold' line_height='xl' size='xs'>
                            {wallet_description.title}
                        </Text>
                    </div>
                    <div className='wallet-details__description'>
                        <Text line_height='xl' color='grey-5' size='xs'>
                            {wallet_description.description}
                        </Text>
                    </div>
                    <div className='wallet-details__information'>
                        <div>
                            <Text as='p' weight='bold' size='xxs' line_height='l'>
                                {wallet_description.deposit_information}
                            </Text>
                        </div>
                        <div className='wallet-details__horizontal-line' />
                        <div>
                            <Text as='p' weight='bold' size='xxs' line_height='l'>
                                {wallet_description.withdrawal_information}
                            </Text>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WalletDescription;
