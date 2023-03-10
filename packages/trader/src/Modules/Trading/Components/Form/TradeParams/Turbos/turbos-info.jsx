import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const TurbosInfo = ({ className, currency, max_stake, min_stake }) => (
    <div className={classNames('turbos-trade-info', className)}>
        {['Min', 'Max'].map(text => (
            <Text
                key={text}
                as='p'
                line_height='s'
                size='xxxs'
                className={classNames({ [`${className}-tooltip-text`]: className })}
            >
                <Localize
                    i18n_default_text='{{text}}. stake <0/>'
                    values={{ text }}
                    components={[
                        <Money
                            key={0}
                            amount={text === 'Min' ? min_stake : max_stake}
                            currency={currency}
                            show_currency
                        />,
                    ]}
                />
            </Text>
        ))}
    </div>
);

TurbosInfo.propTypes = {
    className: PropTypes.string,
    currency: PropTypes.string,
    max_stake: PropTypes.number,
    min_stake: PropTypes.number,
};

export default connect(({ modules }) => ({
    currency: modules.trade.currency,
    max_stake: modules.trade.max_stake,
    min_stake: modules.trade.min_stake,
}))(TurbosInfo);
