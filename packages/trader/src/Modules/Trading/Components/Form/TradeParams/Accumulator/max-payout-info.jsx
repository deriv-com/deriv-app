import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const MaxPayoutInfo = ({ className, currency, max_payout, max_payout_text_size }) => {
    const text_size = max_payout_text_size || 'xxxs';

    return (
        <div className={classNames('accumulators-trade-info--max-payout', className)}>
            <Text
                as='p'
                line_height='s'
                size={text_size}
                className={classNames({
                    [`${className}-tooltip-text`]: className,
                })}
            >
                <Localize
                    i18n_default_text={'Maximum Payout<0>{{max_payout}} {{currency}}</0>'}
                    values={{ max_payout: max_payout.toFixed(2), currency }}
                    components={[<Text key={0} as='p' styles={{ marginLeft: '8px' }} size={text_size} />]}
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
