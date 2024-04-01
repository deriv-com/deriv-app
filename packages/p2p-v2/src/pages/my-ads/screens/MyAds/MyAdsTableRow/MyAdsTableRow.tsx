import React, { memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import { PaymentMethodLabel, PopoverDropdown } from '@/components';
import { ADVERT_TYPE, RATE_TYPE } from '@/constants';
import { useDevice } from '@/hooks';
import { formatMoney, generateEffectiveRate, shouldShowTooltipIcon } from '@/utils';
import { useExchangeRateSubscription } from '@deriv/api-v2';
import { Button, Text, Tooltip } from '@deriv-com/ui';
//TODO: Replace with quill icons once available
import DeactivateIcon from '../../../../../public/ic-archive.svg';
import DeleteIcon from '../../../../../public/ic-delete.svg';
import EditIcon from '../../../../../public/ic-edit.svg';
import ShareIcon from '../../../../../public/ic-share.svg';
import ActivateIcon from '../../../../../public/ic-unarchive.svg';
import { AdStatus, AdType, AlertComponent, ProgressIndicator } from '../../../components';
import { TMyAdsTableRowRendererProps } from '../MyAdsTable/MyAdsTable';
import './MyAdsTableRow.scss';

const BASE_CURRENCY = 'USD';
//TODO: to be modified after design is updated.
const list = [
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete' },
    { label: 'Duplicate', value: 'duplicate' },
    { label: 'Share', value: 'share' },
    { label: 'Deactivate', value: 'deactivate' },
];

type TProps = {
    setIsModalOpen: (value: boolean) => void;
};

type TMyAdsTableProps = Omit<TMyAdsTableRowRendererProps, 'balanceAvailable' | 'dailyBuyLimit' | 'dailySellLimit'> &
    TProps;

const MyAdsTableRow = ({ setIsModalOpen, ...rest }: TMyAdsTableProps) => {
    const { isMobile } = useDevice();
    const { data: exchangeRateValue, subscribe } = useExchangeRateSubscription();

    const {
        account_currency: accountCurrency,
        amount,
        amount_display: amountDisplay,
        effective_rate: effectiveRate,
        id,
        is_active: isActive,
        isBarred,
        isListed,
        local_currency: localCurrency,
        max_order_amount_display: maxOrderAmountDisplay,
        min_order_amount_display: minOrderAmountDisplay,
        onClickIcon,
        payment_method_names: paymentMethodNames,
        price_display: priceDisplay,
        rate_display: rateDisplay,
        rate_type: rateType,
        remaining_amount: remainingAmount,
        remaining_amount_display: remainingAmountDisplay,
        type,
        visibility_status: visibilityStatus = [],
    } = rest;

    const isFloatingRate = rateType === RATE_TYPE.FLOAT;

    useEffect(() => {
        subscribe({
            base_currency: BASE_CURRENCY,
            target_currency: localCurrency,
        });
    }, [localCurrency, subscribe]);

    const [isActionsVisible, setIsActionsVisible] = useState(false);
    const [showAlertIcon, setShowAlertIcon] = useState(false);
    const isAdvertListed = isListed && !isBarred;
    const adPauseColor = isAdvertListed ? 'general' : 'less-prominent';
    const amountDealt = amount - remainingAmount;

    const isRowDisabled = !isActive || isBarred || !isListed;
    const isAdActive = !!isActive && !isBarred;

    const exchangeRate = exchangeRateValue?.rates?.[localCurrency];
    //TODO: get the floating rate configs after completion of floating rate hook.
    // check for rate type and if it is different from the current rate type then enable the action point.
    const enableActionPoint = false;

    useEffect(() => {
        setShowAlertIcon(enableActionPoint || shouldShowTooltipIcon(visibilityStatus) || !isListed);
    }, [enableActionPoint, isListed, shouldShowTooltipIcon]);

    const { displayEffectiveRate } = generateEffectiveRate({
        exchangeRate,
        localCurrency,
        marketRate: Number(effectiveRate),
        price: Number(priceDisplay),
        rate: Number(rateDisplay),
        rateType,
    });

    //TODO: get the floating rate configs after integration with usep2psettings to handle disabled case.

    const advertType = type === 'buy' ? ADVERT_TYPE.BUY : ADVERT_TYPE.SELL;

    const onClickActionItem = (value: string) => {
        onClickIcon(id, value);
    };

    if (isMobile) {
        return (
            <div
                className={clsx('p2p-v2-my-ads-table-row__line', {
                    'p2p-v2-my-ads-table-row__line-disabled': isRowDisabled,
                })}
            >
                <Text color='less-prominent' size='sm'>
                    {`Ad ID ${id} `}
                </Text>
                <div className='p2p-v2-my-ads-table-row__line__type-and-status'>
                    <Text color={adPauseColor} size='lg' weight='bold'>
                        {advertType} {accountCurrency}
                    </Text>
                    <div className='p2p-v2-my-ads-table-row__line__type-and-status__wrapper'>
                        <AdStatus isActive={isAdActive} />
                        {showAlertIcon && <AlertComponent setIsModalOpen={setIsModalOpen} />}
                        <PopoverDropdown
                            dataTestId='dt_p2p_v2_actions_menu'
                            dropdownList={list}
                            onClick={value => onClickActionItem(value)}
                        />
                    </div>
                </div>
                <div className='p2p-v2-my-ads-table-row__line-details'>
                    <Text color='success' size='sm'>
                        {`${formatMoney(accountCurrency, amountDealt, true)}`} {accountCurrency}&nbsp;
                        {advertType === 'Buy' ? 'Bought' : 'Sold'}
                    </Text>
                    <Text color='less-prominent' size='sm'>
                        {amountDisplay} {accountCurrency}
                    </Text>
                </div>
                <ProgressIndicator
                    className={'p2p-v2-my-ads-table-row__available-progress'}
                    total={amount}
                    value={amountDealt}
                />
                <div className='p2p-v2-my-ads-table-row__line-details'>
                    <Text color='less-prominent' size='sm'>
                        Limits
                    </Text>
                    <Text color='less-prominent' size='sm'>
                        {`Rate (1 ${accountCurrency})`}
                    </Text>
                </div>
                <div className='p2p-v2-my-ads-table-row__line-details'>
                    <Text color={adPauseColor} size='sm'>
                        {minOrderAmountDisplay} - {maxOrderAmountDisplay} {accountCurrency}
                    </Text>
                    <Text color='success' weight='bold'>
                        <div className='display-layout'>
                            {displayEffectiveRate} {localCurrency}
                            {isFloatingRate && <AdType adPauseColor={adPauseColor} floatRate={rateDisplay} />}
                        </div>
                    </Text>
                </div>
                <div className='gap-2 p2p-v2-my-ads-table-row__line-methods'>
                    {paymentMethodNames?.map(paymentMethod => (
                        <PaymentMethodLabel
                            color={adPauseColor}
                            key={paymentMethod}
                            paymentMethodName={paymentMethod}
                            size='xs'
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className={clsx('p2p-v2-my-ads-table-row__line', {
                'p2p-v2-my-ads-table-row__line-disabled': isRowDisabled,
            })}
            onMouseEnter={() => setIsActionsVisible(true)}
            onMouseLeave={() => setIsActionsVisible(false)}
        >
            <Text size='sm'>
                {advertType} {id}
            </Text>
            <Text size='sm'>
                {minOrderAmountDisplay} - {maxOrderAmountDisplay} {accountCurrency}
            </Text>
            <Text className='p2p-v2-my-ads-table-row__rate' size='sm'>
                {displayEffectiveRate} {localCurrency}
                {isFloatingRate && <AdType adPauseColor={adPauseColor} floatRate={rateDisplay} />}
            </Text>
            <Text className='p2p-v2-my-ads-table-row__available' size='sm'>
                <ProgressIndicator
                    className={'p2p-v2-my-ads-table-row__available-progress'}
                    total={amount}
                    value={remainingAmount}
                />
                {remainingAmountDisplay}/{amountDisplay} {accountCurrency}
            </Text>
            <div className='flex flex-wrap gap-2'>
                {paymentMethodNames?.map(paymentMethod => (
                    <PaymentMethodLabel
                        color={adPauseColor}
                        key={paymentMethod}
                        paymentMethodName={paymentMethod}
                        size='xs'
                    />
                ))}
            </div>
            <div className='p2p-v2-my-ads-table-row__actions'>
                {isActionsVisible ? (
                    <div className='p2p-v2-my-ads-table-row__actions-popovers'>
                        <Button
                            color='white'
                            onClick={() => onClickActionItem(isActive ? 'deactivate' : 'activate')}
                            variant='contained'
                        >
                            <Tooltip message={isActive ? 'Deactivate' : 'Activate'} position='bottom'>
                                {isActive ? <DeactivateIcon /> : <ActivateIcon />}
                            </Tooltip>
                        </Button>
                        <Button color='white' onClick={() => onClickActionItem('edit')} variant='contained'>
                            <Tooltip message='Edit' position='bottom'>
                                <EditIcon />
                            </Tooltip>
                        </Button>
                        <Button color='white' onClick={() => onClickActionItem('delete')} variant='contained'>
                            <Tooltip message='Delete' position='bottom'>
                                <DeleteIcon />
                            </Tooltip>
                        </Button>
                        <Button color='white' onClick={() => onClickActionItem('share')} variant='contained'>
                            <Tooltip message='Share' position='bottom'>
                                <ShareIcon />
                            </Tooltip>
                        </Button>
                    </div>
                ) : (
                    <AdStatus isActive={isAdActive} />
                )}
                {showAlertIcon && <AlertComponent setIsModalOpen={setIsModalOpen} />}
            </div>
        </div>
    );
};

export default memo(MyAdsTableRow);
