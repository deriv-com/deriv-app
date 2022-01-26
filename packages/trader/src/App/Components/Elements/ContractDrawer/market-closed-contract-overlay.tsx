import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
// eslint-disable-next-line import/no-useless-path-segments
import MarketCountdownTimer from '../market-countdown-timer.jsx';

type MarketClosedContractOverlayProps = {
    symbol: string;
};

const MarketClosedContractOverlay = ({ symbol }: MarketClosedContractOverlayProps) => {
    const [is_timer_loading, setIsTimerLoading] = React.useState(true);

    return (
        <div
            className={classNames('contract-card__market-closed', {
                'contract-card__market-closed--loading': is_timer_loading,
            })}
        >
            <Text
                align='center'
                as='p'
                className='contract-card__market-closed__title'
                styles={{ color: 'var(--brand-orange)' }}
                weight='bold'
            >
                <Localize i18n_default_text='Market is closed' />
            </Text>
            <MarketCountdownTimer setIsTimerLoading={setIsTimerLoading} symbol={symbol} />
        </div>
    );
};

export default MarketClosedContractOverlay;
