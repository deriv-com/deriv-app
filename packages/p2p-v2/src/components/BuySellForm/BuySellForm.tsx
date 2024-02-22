/* eslint-disable camelcase */
import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { removeTrailingZeros, roundOffDecimal, setDecimalPlaces } from '@/utils';
import { p2p } from '@deriv/api';
import { Divider, useDevice } from '@deriv-com/ui';
import { BuySellAmount } from '../BuySellAmount';
import { BuySellData } from '../BuySellData';
import { BuySellFormFooter } from '../BuySellFormFooter';
import { BuySellFormHeader } from '../BuySellFormHeader';
import { customStyles } from '../Modals/helpers';
import './BuySellForm.scss';

type NonUndefinedValues<T> = {
    [K in keyof T]-?: Exclude<T[K], undefined>;
};

type TAdvertData = NonNullable<ReturnType<typeof p2p.advert.useGet>['data']>;

type TBuySellFormProps = {
    advert: NonUndefinedValues<TAdvertData>;
    advertiserBuyLimit: number;
    advertiserSellLimit: number;
    displayEffectiveRate: string;
    effectiveRate: number;
    isModalOpen: boolean;
    onRequestClose: () => void;
    paymentMethods: ReturnType<typeof p2p.advertiserPaymentMethods.useGet>['data'];
};

const getAdvertiserMaxLimit = (
    isBuy: boolean,
    advertiserBuyLimit: number,
    advertiserSellLimit: number,
    maxOrderAmountLimitDisplay: string
) => {
    if (!isBuy) {
        if (advertiserBuyLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserBuyLimit);
    } else if (advertiserSellLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserSellLimit);
    return maxOrderAmountLimitDisplay;
};

const BuySellForm = ({
    advert,
    advertiserBuyLimit,
    advertiserSellLimit,
    displayEffectiveRate,
    effectiveRate,
    isModalOpen,
    onRequestClose,
    paymentMethods,
}: TBuySellFormProps) => {
    const { mutate } = p2p.order.useCreate();
    const {
        account_currency,
        advertiser_details,
        description,
        id,
        is_buy,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        order_expiry_period,
        payment_method_names,
        rate,
        type,
    } = advert;
    const {
        control,
        formState: { isValid },
        getValues,
        handleSubmit,
    } = useForm({
        defaultValues: {
            amount: min_order_amount_limit ?? 1,
        },
        mode: 'onChange',
    });
    const { isMobile } = useDevice();

    const onSubmit = () => {
        //TODO: error handling after implementation of exchange rate
        mutate({
            advert_id: id,
            amount: getValues('amount'),
            rate,
        });
    };

    const calculatedRate = removeTrailingZeros(roundOffDecimal(effectiveRate, setDecimalPlaces(effectiveRate, 6)));
    const initialAmount = removeTrailingZeros((min_order_amount_limit * Number(calculatedRate)).toString());

    return (
        <Modal
            className='p2p-v2-buy-sell-form'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            style={{ ...customStyles, overlay: { ...customStyles.overlay, top: `${isMobile ? '16rem' : 0}` } }}
        >
            <BuySellFormHeader
                currency={account_currency}
                onClickBack={isMobile ? onRequestClose : undefined}
                type={type}
            />
            <Divider />
            {/* TODO: Add inline message component and message for error handling in floating rate */}
            <form onSubmit={() => handleSubmit(onSubmit)}>
                <BuySellData
                    accountCurrency={account_currency}
                    expiryPeriod={order_expiry_period ?? 3600}
                    instructions={description ?? '-'}
                    isBuy={is_buy}
                    localCurrency={local_currency}
                    name={advertiser_details?.name}
                    paymentMethodNames={payment_method_names}
                    paymentMethods={paymentMethods}
                    rate={displayEffectiveRate}
                />
                <Divider />
                <BuySellAmount
                    accountCurrency={account_currency}
                    amount={initialAmount}
                    calculatedRate={calculatedRate}
                    control={control}
                    effectiveRate={effectiveRate}
                    isBuy={is_buy}
                    localCurrency={local_currency}
                    maxLimit={getAdvertiserMaxLimit(
                        is_buy,
                        advertiserBuyLimit,
                        advertiserSellLimit,
                        max_order_amount_limit_display
                    )}
                    minLimit={min_order_amount_limit_display}
                />
                <Divider />
                <BuySellFormFooter isDisabled={!isValid} onClickCancel={onRequestClose} onSubmit={onSubmit} />
            </form>
        </Modal>
    );
};

export default BuySellForm;
