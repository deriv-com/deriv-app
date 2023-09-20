import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';

type TTradeBadge = {
    is_poa_verified?: boolean;
    is_poi_verified?: boolean;
    large?: boolean;
    trade_count: number;
};

const TradeBadge = ({ is_poa_verified = false, is_poi_verified = false, large = false, trade_count }: TTradeBadge) => {
    return (
        <React.Fragment>
            {trade_count > 100 && (
                <div
                    className={classNames('trade-badge', {
                        'trade-badge--large': large,
                        'trade-badge--gold': trade_count >= 100 && trade_count < 250,
                        'trade-badge--green': trade_count >= 250,
                    })}
                >
                    <Text color='colored-background' size='xxxs'>
                        {`${trade_count >= 250 ? '250+' : '100+'} ${large ? localize('trades') : ''}`}
                    </Text>
                </div>
            )}
            {is_poi_verified && (
                <div className='trade-badge trade-badge--blue'>
                    <Text color='colored-background' size='xxxs'>
                        <Localize
                            i18n_default_text='<0>ID</0> verified'
                            components={[<Text key={0} color='colored-background' size='xxxs' weight='bold' />]}
                        />
                    </Text>
                </div>
            )}
            {is_poa_verified && (
                <div className='trade-badge trade-badge--blue'>
                    <Text color='colored-background' size='xxxs'>
                        <Localize
                            i18n_default_text='<0>Address</0> verified'
                            components={[<Text key={0} color='colored-background' size='xxxs' weight='bold' />]}
                        />
                    </Text>
                </div>
            )}
        </React.Fragment>
    );
};

export default TradeBadge;
