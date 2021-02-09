import * as React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import TradingAppBanner from 'Components/my-apps/banner/app-banner/trading-app-banner';
import SwapFreeBanner from 'Components/my-apps/banner/app-banner/swap-free-banner';
import CFDsBanner from 'Components/my-apps/banner/app-banner/cfds-banner';
import WalletBanner from 'Components/my-apps/banner/wallet-banner';

const Real: React.FC<TRealProps> = ({}) => {
    return (
        <React.Fragment>
            {true ? (
                <React.Fragment>
                    <div className='dw-my-apps__wallet-section'>
                        <Text size='m' weight='bold' line_height='xs'>
                            {localize('My Wallets')}
                        </Text>
                        <div className='dw-my-apps__wallet-section-container'>
                            <WalletBanner getWalletClick={() => console.log('Get wallet clicked!')} />
                        </div>
                    </div>
                    <div className='dw-my-apps__app-section-container'>
                        <TradingAppBanner getTradingAppClick={() => console.log('Trading app clicked')} small={false} />
                        {/* <div className='dw-my-apps__app-card-separator'> */}
                        <CFDsBanner
                            getDmt5SyntheticsClick={() => console.log('DMT5 Synthetics clicked')}
                            getDmt5FinancialClick={() => console.log('DMT5 Financial clicked')}
                            getDmt5FinancialStpClick={() => console.log('DMT5FinancialSTP clicked')}
                            small={false}
                        />
                        {/* </div> */}
                        <SwapFreeBanner
                            getDmt5SyntheticsClick={() => console.log('DMT5 Synthetics clicked')}
                            getDmt5FinancialClick={() => console.log('DMT5Financial clicked')}
                            small={false}
                        />
                    </div>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <div className='dw-my-apps__app-section dw-my-apps__app-section-separator'>
                        <Text size='m' weight='bold' line_height='xs'>
                            {localize('Options & Multipliers')}
                        </Text>
                    </div>
                    <div className='dw-my-apps__app-section dw-my-apps__app-section-separator'>
                        <Text size='m' weight='bold' line_height='xs'>
                            {localize('CFDs')}
                        </Text>
                    </div>
                    <div className='dw-my-apps__app-section'>
                        <Text size='m' weight='bold' line_height='xs'>
                            {localize('Swap-free')}
                        </Text>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

type TRealProps = {};

export default Real;
