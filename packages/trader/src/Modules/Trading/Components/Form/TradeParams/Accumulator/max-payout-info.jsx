import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MaxPayoutInfo = ({ className, currency, max_payout, max_payout_text_size }) => {
    return (
        <div
            className={classNames(
                'accumulators-trade-info',
                className,
                'mobile-widget__multiplier-trade-info--no-stop-out'
            )}
        >
            <Text
                as='p'
                line_height='s'
                size={max_payout_text_size || 'xxxs'}
                className={classNames({
                    [`${className}-tooltip-text`]: className,
                })}
            >
                <Localize
                    i18n_default_text={'Maximum Payout {{max_payout}} {{currency}}'}
                    values={{ max_payout: max_payout.toFixed(2), currency }}
                />
            </Text>
        </div>
    );
};

MaxPayoutInfo.propTypes = {
    className: PropTypes.string,
    currency: PropTypes.string,
    max_payout: PropTypes.string,
    max_payout_text_size: PropTypes.string,
};

export default connect(({ modules }) => ({
    currency: modules.trade.currency,
    max_payout: modules.trade.max_payout,
}))(MaxPayoutInfo);
