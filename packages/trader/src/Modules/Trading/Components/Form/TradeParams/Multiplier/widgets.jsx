import React from 'react';
import classNames from 'classnames';
import { Money, Text, Popover } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer } from '@deriv/stores';
import MultiplierAmountModal from 'Modules/Trading/Containers/Multiplier/multiplier-amount-modal';
import RadioGroupOptionsModal from 'Modules/Trading/Containers/radio-group-options-modal';
import MultipliersExpiration from 'Modules/Trading/Components/Form/TradeParams/Multiplier/expiration.jsx';
import MultipliersExpirationModal from 'Modules/Trading/Components/Form/TradeParams/Multiplier/expiration-modal.jsx';
import MultipliersInfo from 'Modules/Trading/Components/Form/TradeParams/Multiplier/info';
import { localize, Localize } from '@deriv/translations';
import { getGrowthRatePercentage, getTickSizeBarrierPercentage } from '@deriv/shared';
import { showLabelForMultipliers } from '../../../../Helpers/contract-type';

const AmountWidget = ({ amount, currency, expiration, is_crypto_multiplier }) => {
    const [is_open, setIsOpen] = React.useState(false);
    const [is_expiration_modal_open, setIsExpirationModalOpen] = React.useState(false);

    const toggleModal = () => {
        setIsOpen(!is_open);
    };

    const toggleExpirationModal = () => {
        setIsExpirationModalOpen(!is_expiration_modal_open);
    };

    return (
        <React.Fragment>
            <MultiplierAmountModal is_open={is_open} toggleModal={toggleModal} />
            <div className='mobile-widget mobile-widget__multiplier' onClick={toggleModal}>
                <div className='mobile-widget__multiplier-amount'>
                    <div className='mobile-widget__item'>
                        <Text weight='bold' size='xxs'>
                            <Money amount={amount} currency={currency} show_currency />
                        </Text>
                    </div>
                </div>
                <MultipliersInfo
                    className='mobile-widget__multiplier-trade-info'
                    commission_text_size='xxxxs'
                    stop_out_text_size='xxxxs'
                />
            </div>
            {is_crypto_multiplier && (
                <div className='mobile-widget' onClick={expiration ? toggleExpirationModal : null}>
                    <div className='mobile-widget__multiplier-expiration'>
                        <Text size='xxs'>{localize('Expires on')}</Text>
                        <MultipliersExpiration is_text_only text_size='xxs' />
                    </div>
                    <MultipliersExpirationModal
                        is_open={is_expiration_modal_open}
                        toggleModal={toggleExpirationModal}
                    />
                </div>
            )}
        </React.Fragment>
    );
};

export const MultiplierAmountWidget = observer(() => {
    const { amount, expiration, currency, is_crypto_multiplier, multiplier } = useTraderStore();
    const amount_widget_props = {
        amount,
        expiration,
        currency,
        is_crypto_multiplier,
        multiplier,
    };
    return <AmountWidget {...amount_widget_props} />;
});

const RadioGroupOptionsWidget = ({
    displayed_trade_param,
    tooltip_message,
    is_disabled,
    modal_title,
    should_show_new_label,
}) => {
    const [is_open, setIsOpen] = React.useState(false);

    const toggleModal = () => {
        if (is_disabled) return;
        setIsOpen(!is_open);
    };

    return (
        <React.Fragment>
            <RadioGroupOptionsModal is_open={is_open} toggleModal={toggleModal} modal_title={modal_title} />
            <div
                className={classNames('mobile-widget mobile-widget__multiplier-options', {
                    'mobile-widget__label': should_show_new_label,
                })}
                onClick={toggleModal}
            >
                <div
                    className={classNames('mobile-widget__item', {
                        'mobile-widget__item-disabled': is_disabled,
                    })}
                >
                    <span className='mobile-widget__item-value'>{displayed_trade_param}</span>
                </div>
                {!!tooltip_message && (
                    <span className='mobile-widget__item-tooltip' onClick={e => e.stopPropagation()}>
                        <Popover
                            alignment='left'
                            classNameBubble='mobile-widget__item-popover'
                            icon='info'
                            is_bubble_hover_enabled
                            zIndex={9999}
                            message={tooltip_message}
                        />
                    </span>
                )}
                {should_show_new_label && (
                    <Text
                        className='dc-dropdown__label--new'
                        weight='bold'
                        size='xxxs'
                        line_height='s'
                        color='colored-background'
                    >
                        <Localize i18n_default_text='NEW!' />
                    </Text>
                )}
            </div>
        </React.Fragment>
    );
};

export const MultiplierOptionsWidget = observer(() => {
    const { multiplier, symbol } = useTraderStore();
    const displayed_trade_param = `x${multiplier}`;
    const modal_title = localize('Multiplier');
    return (
        <RadioGroupOptionsWidget
            displayed_trade_param={displayed_trade_param}
            modal_title={modal_title}
            should_show_new_label={showLabelForMultipliers(symbol)}
        />
    );
});

export const AccumulatorOptionsWidget = observer(() => {
    const { growth_rate, has_open_accu_contract, tick_size_barrier } = useTraderStore();
    const displayed_trade_param = `${getGrowthRatePercentage(growth_rate)}%`;
    const modal_title = localize('Growth rate');
    const tooltip_message = (
        <Localize
            i18n_default_text='Your stake will grow at {{growth_rate}}% per tick as long as the current spot price remains within ±{{tick_size_barrier}} from the previous spot price.'
            values={{
                growth_rate: getGrowthRatePercentage(growth_rate),
                tick_size_barrier: getTickSizeBarrierPercentage(tick_size_barrier),
            }}
        />
    );
    return (
        <RadioGroupOptionsWidget
            displayed_trade_param={displayed_trade_param}
            is_disabled={has_open_accu_contract}
            modal_title={modal_title}
            tooltip_message={tooltip_message}
        />
    );
});
