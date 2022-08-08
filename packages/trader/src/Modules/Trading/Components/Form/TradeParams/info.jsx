import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const INFO_TYPES = {
    MULTIP: 'multipliers',
};

const commission_tooltip_margin = 30;
const stop_out_tooltip_margin = 160;

const Info = ({
    amount = 0,
    className,
    commission = 0,
    commission_text_size,
    currency,
    has_stop_loss,
    info_type,
    is_tooltip_relative,
    multiplier = 0,
    should_show_tooltip,
    stop_out = 0,
    stop_out_text_size,
}) => {
    const getInfoContent = () => {
        let info_content;
        if (info_type === INFO_TYPES.MULTIP) {
            info_content = [
                {
                    info_text: (
                        <Localize
                            i18n_default_text='Commission <0/>'
                            components={[<Money key={0} amount={commission} currency={currency} show_currency />]}
                        />
                    ),
                    margin: commission_tooltip_margin,
                    text_size: commission_text_size,
                    tooltip_message: (
                        <Localize
                            i18n_default_text='<0>{{commission_percentage}}%</0> of (<1/> * {{multiplier}})'
                            values={{
                                commission_percentage: Number((commission * 100) / (multiplier * amount)).toFixed(4),
                                multiplier,
                            }}
                            components={[
                                <Text size='xxs' weight='bold' key={0} />,
                                <Money key={1} amount={amount} currency={currency} />,
                            ]}
                        />
                    ),
                },
                {
                    info_text: (
                        <Localize
                            i18n_default_text='Stop out <0/>'
                            components={[<Money key={0} amount={stop_out} currency={currency} show_currency />]}
                        />
                    ),
                    margin: stop_out_tooltip_margin,
                    text_size: stop_out_text_size,
                    tooltip_message: (
                        <Localize
                            i18n_default_text='When your current loss equals or exceeds {{stop_out_percentage}}% of your stake, your contract will be closed at the nearest available asset price.'
                            values={{
                                stop_out_percentage: Math.floor(Math.abs(Number((stop_out * 100) / amount))),
                            }}
                        />
                    ),
                    is_hidden: has_stop_loss,
                },
            ];
        }
        return info_content.filter(_item => !_item.is_hidden);
    };

    const getText = ({ info_text, text_size }, index) => {
        return (
            <Text
                key={index}
                as='p'
                line_height='s'
                size={text_size || 'xxxs'}
                className={classNames({
                    [`${className}-tooltip-text`]: className,
                })}
            >
                {info_text}
            </Text>
        );
    };

    return (
        <div
            className={classNames(`${info_type}-trade-info`, className, {
                'mobile-widget__multiplier-trade-info--no-stop-out': has_stop_loss && info_type === INFO_TYPES.MULTIP,
            })}
        >
            {getInfoContent().map(({ tooltip_message, margin, ...rest }, index) => {
                return should_show_tooltip ? (
                    <Popover
                        key={index}
                        message={tooltip_message}
                        {...(is_tooltip_relative
                            ? { alignment: 'left', relative_render: true, margin }
                            : { alignment: 'top', zIndex: 9999 })}
                    >
                        {getText(rest, index)}
                    </Popover>
                ) : (
                    getText(rest, index)
                );
            })}
        </div>
    );
};

Info.propTypes = {
    amount: PropTypes.number,
    className: PropTypes.string,
    commission: PropTypes.number,
    commission_text_size: PropTypes.string,
    currency: PropTypes.string,
    has_stop_loss: PropTypes.bool,
    info_type: PropTypes.string,
    is_tooltip_relative: PropTypes.bool,
    multiplier: PropTypes.number,
    should_show_tooltip: PropTypes.bool,
    stop_out: PropTypes.number,
    stop_out_text_size: PropTypes.string,
};

export const MultipliersInfo = connect(({ modules }, props) => ({
    amount: props.amount ?? modules.trade.amount,
    commission: props.commission ?? modules.trade.commission,
    currency: modules.trade.currency,
    has_stop_loss: modules.trade.has_stop_loss,
    multiplier: modules.trade.multiplier,
    stop_out: props.stop_out ?? modules.trade.stop_out,
    info_type: INFO_TYPES.MULTIP,
}))(Info);
