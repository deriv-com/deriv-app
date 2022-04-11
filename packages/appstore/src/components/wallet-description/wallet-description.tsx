import React from 'react';
import { Text } from '@deriv/components';
import wallet_descriptions from 'Constants/wallet-description';
import { WizardContext } from 'Components/wizard-containers';

const WalletDescription = () => {
    const { selected_wallet } = React.useContext(WizardContext);

    const wallet_description = selected_wallet && wallet_descriptions[selected_wallet];

    return (
        <>
            {wallet_description && (
                <div className='wallet-details'>
                    <div className='wallet-details__title'>
                        <Text as='p' weight='bold' size='xs'>
                            {wallet_description.title}
                        </Text>
                    </div>
                    <div className='wallet-details__description'>
                        <Text color='grey-5' size='xs'>
                            {wallet_description.description}
                        </Text>
                    </div>
                    <div className='wallet-details__information'>
                        <div>
                            <Text as='p' weight='bold' size='xxs'>
                                {wallet_description.deposit_information}
                            </Text>
                        </div>
                        <div className='wallet-details__horizontal-line' />
                        <div>
                            <Text as='p' weight='bold' size='xxs'>
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
