/* eslint-disable camelcase */
import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import { TAdvertType } from 'types';
import { BUY_SELL, RATE_TYPE } from '@/constants';
import { removeTrailingZeros, roundOffDecimal, setDecimalPlaces } from '@/utils';
import { p2p } from '@deriv/api-v2';
import { Divider, InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { BuySellAmount } from '../BuySellAmount';
import { BuySellData } from '../BuySellData';
import { BuySellFormFooter } from '../BuySellFormFooter';
import { BuySellFormHeader } from '../BuySellFormHeader';
import { customStyles } from '../Modals/helpers';
import './BuySellForm.scss';

type TBuySellFormProps = {
    advert: TAdvertType;
    advertiserBuyLimit: number;
    advertiserSellLimit: number;
    balanceAvailable: number;
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
    if (isBuy) {
        if (advertiserBuyLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserBuyLimit);
    } else if (advertiserSellLimit < Number(maxOrderAmountLimitDisplay)) return roundOffDecimal(advertiserSellLimit);
    return maxOrderAmountLimitDisplay;
};

const BuySellForm = ({
    advert,
    advertiserBuyLimit,
    advertiserSellLimit,
    balanceAvailable,
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
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit,
        min_order_amount_limit_display,
        order_expiry_period,
        payment_method_names,
        rate_type,
        type,
    } = advert;

    const isBuy = type === BUY_SELL.BUY;
    const shouldDisableField =
        !isBuy &&
        (parseFloat(balanceAvailable.toString()) === 0 ||
            parseFloat(balanceAvailable.toString()) < min_order_amount_limit);

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
        const rateValue = rate_type === RATE_TYPE.FIXED ? null : effectiveRate;
        const payload = {
            advert_id: id,
            amount: Number(getValues('amount')),
        };
        if (rateValue) {
            payload.rate = rateValue;
        }
        mutate(payload);
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
            {rate_type === RATE_TYPE.FLOAT && !shouldDisableField && (
                <div className='px-[2.4rem] mt-[2.4rem]'>
                    <InlineMessage variant='info'>
                        <Text size={isMobile ? 'xs' : '2xs'}>
                            {`If the market rate changes from the rate shown here, we won't be able to process your order.`}
                        </Text>
                    </InlineMessage>
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <BuySellData
                    accountCurrency={account_currency}
                    expiryPeriod={order_expiry_period ?? 3600}
                    instructions={description ?? '-'}
                    isBuy={isBuy}
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
                    isBuy={isBuy}
                    isDisabled={shouldDisableField}
                    localCurrency={local_currency}
                    maxLimit={getAdvertiserMaxLimit(
                        isBuy,
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
