import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';

const TradeBadge = ({ is_poa_verified = false, is_poi_verified = false, large = false, trade_count }) => {
    return (
        <React.Fragment>
            {trade_count > 100 ? (
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
            ) : null}
            {is_poi_verified ? (
                <div
                    className={classNames('trade-badge', {
                        'trade-badge--blue': is_poa_verified || is_poi_verified,
                    })}
                >
                    <Text color='colored-background' size='xxxs'>
                        <Localize
                            i18n_default_text='<0>ID</0> verified'
                            components={[<Text key={0} color='colored-background' size='xxxs' weight='bold' />]}
                        />
                    </Text>
                </div>
            ) : null}
            {is_poa_verified ? (
                <div
                    className={classNames('trade-badge', {
                        'trade-badge--blue': is_poa_verified || is_poi_verified,
                    })}
                >
                    <Text color='colored-background' size='xxxs'>
                        <Localize
                            i18n_default_text='<0>Address</0> verified'
                            components={[<Text key={0} color='colored-background' size='xxxs' weight='bold' />]}
                        />
                    </Text>
                </div>
            ) : null}
        </React.Fragment>
    );
};

export default TradeBadge;

TradeBadge.propTypes = {
    is_poa_verified: PropTypes.bool,
    is_poi_verified: PropTypes.bool,
    large: PropTypes.bool,
    trade_count: PropTypes.number,
};
