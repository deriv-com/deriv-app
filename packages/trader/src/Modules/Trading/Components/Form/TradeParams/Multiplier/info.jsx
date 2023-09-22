import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const commission_tooltip_margin = 30;
const stop_out_tooltip_margin = 160;

const MultipliersInfo = observer(
    ({ className, commission_text_size, stop_out_text_size, is_tooltip_relative, should_show_tooltip, ...props }) => {
        const trade = useTraderStore();
        const { currency, has_stop_loss } = trade;
        const multiplier = props.multiplier ?? (trade.multiplier || 0);
        const amount = props.amount ?? (trade.amount || 0);
        const commission = props.commission ?? (trade.commission || 0);
        const stop_out = props.stop_out ?? (trade.stop_out || 0);

        const commission_text = (
            <Text
                as='p'
                line_height='s'
                size={commission_text_size || 'xxxs'}
                className={classNames({
                    [`${className}-tooltip-text`]: className,
                })}
            >
                <Localize
                    i18n_default_text='Commission <0/>'
                    components={[<Money key={0} amount={commission} currency={currency} show_currency />]}
                />
            </Text>
        );

        const stop_out_text = (
            <Text
                as='p'
                line_height='s'
                size={stop_out_text_size || 'xxxs'}
                className={classNames({
                    [`${className}-tooltip-text`]: className,
                })}
            >
                <Localize
                    i18n_default_text='Stop out <0/>'
                    components={[<Money key={0} amount={stop_out} currency={currency} show_currency />]}
                />
            </Text>
        );

        const commission_tooltip = (
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
        );

        const stop_out_tooltip = (
            <Localize
                i18n_default_text='When your current loss equals or exceeds {{stop_out_percentage}}% of your stake, your contract will be closed at the nearest available asset price.'
                values={{
                    stop_out_percentage: Math.floor(Math.abs(Number((stop_out * 100) / amount))),
                }}
            />
        );

        const getInfo = ({ text, message, margin }) => {
            return should_show_tooltip ? (
                <Popover
                    message={message}
                    {...(is_tooltip_relative
                        ? { alignment: 'left', relative_render: true, margin }
                        : { alignment: 'top', zIndex: 9999 })}
                >
                    {text}
                </Popover>
            ) : (
                text
            );
        };

        return (
            <div
                className={classNames('multipliers-trade-info', className, {
                    'mobile-widget__multiplier-trade-info--no-stop-out': has_stop_loss,
                })}
            >
                {getInfo({
                    text: commission_text,
                    message: commission_tooltip,
                    margin: commission_tooltip_margin,
                })}
                {!has_stop_loss &&
                    getInfo({
                        text: stop_out_text,
                        message: stop_out_tooltip,
                        margin: stop_out_tooltip_margin,
                    })}
            </div>
        );
    }
);

MultipliersInfo.propTypes = {
    className: PropTypes.string,
    commission_text_size: PropTypes.string,
    is_tooltip_relative: PropTypes.bool,
    should_show_tooltip: PropTypes.bool,
    stop_out_text_size: PropTypes.string,
};

export default MultipliersInfo;
