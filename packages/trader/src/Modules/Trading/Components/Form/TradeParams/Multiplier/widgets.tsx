import React from 'react';
import { Money, Text } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer } from '@deriv/stores';
import MultiplierAmountModal from 'Modules/Trading/Containers/Multiplier/multiplier-amount-modal';
import RadioGroupOptionsModal from 'Modules/Trading/Containers/radio-group-options-modal.jsx';
import MultipliersExpiration from 'Modules/Trading/Components/Form/TradeParams/Multiplier/expiration';
import MultipliersExpirationModal from 'Modules/Trading/Components/Form/TradeParams/Multiplier/expiration-modal';
import MultipliersInfo from 'Modules/Trading/Components/Form/TradeParams/Multiplier/info';
import { Localize } from '@deriv/translations';
import { getGrowthRatePercentage } from '@deriv/shared';

type TAmountWidgetProps = {
    amount: number;
    currency: string;
    expiration?: number;
    is_crypto_multiplier: boolean;
};

type TRadioGroupOptionsWidgetProps = {
    displayed_trade_param: string;
    modal_title: React.ReactNode;
};

const AmountWidget = ({ amount, currency, expiration, is_crypto_multiplier }: TAmountWidgetProps) => {
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
                <div className='mobile-widget' onClick={expiration ? toggleExpirationModal : undefined}>
                    <div className='mobile-widget__multiplier-expiration'>
                        <Text size='xxs'>
                            <Localize i18n_default_text='Expires on' />
                        </Text>
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
    const { amount, expiration, currency, is_crypto_multiplier } = useTraderStore();
    const amount_widget_props = {
        amount,
        expiration,
        currency,
        is_crypto_multiplier,
    };
    return <AmountWidget {...amount_widget_props} />;
});

const RadioGroupOptionsWidget = ({ displayed_trade_param, modal_title }: TRadioGroupOptionsWidgetProps) => {
    const [is_open, setIsOpen] = React.useState(false);

    const toggleModal = () => {
        setIsOpen(!is_open);
    };

    return (
        <React.Fragment>
            {/* @ts-expect-error TODO: check if TS error is gone after RadioGroupOptionsModal is migrated to TS */}
            <RadioGroupOptionsModal is_open={is_open} toggleModal={toggleModal} modal_title={modal_title} />
            <div className='mobile-widget mobile-widget__multiplier-options' onClick={toggleModal}>
                <div className='mobile-widget__item'>
                    <span className='mobile-widget__item-value'>{displayed_trade_param}</span>
                </div>
            </div>
        </React.Fragment>
    );
};

export const MultiplierOptionsWidget = observer(() => {
    const { multiplier } = useTraderStore();
    return (
        <RadioGroupOptionsWidget
            displayed_trade_param={`x${multiplier}`}
            modal_title={<Localize i18n_default_text='Multiplier' />}
        />
    );
});

export const AccumulatorOptionsWidget = observer(() => {
    const { growth_rate } = useTraderStore();
    return (
        <RadioGroupOptionsWidget
            displayed_trade_param={`${getGrowthRatePercentage(growth_rate)}%`}
            modal_title={<Localize i18n_default_text='Growth rate' />}
        />
    );
});
