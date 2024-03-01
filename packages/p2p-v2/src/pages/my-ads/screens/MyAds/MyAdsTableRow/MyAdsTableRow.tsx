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
        account_currency,
        amount,
        amount_display,
        effective_rate,
        id,
        is_active,
        isBarred,
        isListed,
        local_currency,
        max_order_amount_display,
        min_order_amount_display,
        onClickIcon,
        payment_method_names,
        price_display,
        rate_display,
        rate_type,
        remaining_amount,
        remaining_amount_display,
        type,
        visibility_status = [],
    } = rest;

    useEffect(() => {
        subscribe({
            base_currency: BASE_CURRENCY,
            target_currency: local_currency,
        });
    }, [local_currency, subscribe]);

    const [isActionsVisible, setIsActionsVisible] = useState(false);
    const [showAlertIcon, setShowAlertIcon] = useState(false);
    const isAdvertListed = isListed && !isBarred;
    const adPauseColor = isAdvertListed ? 'general' : 'less-prominent';
    const amountDealt = amount - remaining_amount;

    const isRowDisabled = !is_active || isBarred || !isListed;
    const isAdActive = !!is_active && !isBarred;

    const exchangeRate = exchangeRateValue?.rates?.[local_currency];
    //TODO: get the floating rate configs after completion of floating rate hook.
    // check for rate type and if it is different from the current rate type then enable the action point.
    const enableActionPoint = false;

    useEffect(() => {
        setShowAlertIcon(enableActionPoint || shouldShowTooltipIcon(visibility_status) || !isListed);
    }, [enableActionPoint, isListed, shouldShowTooltipIcon]);

    const { displayEffectiveRate } = generateEffectiveRate({
        price: Number(price_display),
        rateType: rate_type,
        rate: Number(rate_display),
        localCurrency: local_currency,
        exchangeRate,
        marketRate: Number(effective_rate),
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
                        {advertType} {account_currency}
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
                        {`${formatMoney(account_currency, amountDealt, true)}`} {account_currency}&nbsp;
                        {advertType === 'Buy' ? 'Bought' : 'Sold'}
                    </Text>
                    <Text color='less-prominent' size='sm'>
                        {amount_display} {account_currency}
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
                        {`Rate (1 ${account_currency})`}
                    </Text>
                </div>
                <div className='p2p-v2-my-ads-table-row__line-details'>
                    <Text color={adPauseColor} size='sm'>
                        {min_order_amount_display} - {max_order_amount_display} {account_currency}
                    </Text>
                    <Text color='success' weight='bold'>
                        <div className='display-layout'>
                            {displayEffectiveRate} {local_currency}
                            {rate_type === RATE_TYPE.FLOAT && (
                                <AdType adPauseColor={adPauseColor} floatRate={rate_display} />
                            )}
                        </div>
                    </Text>
                </div>
                <div className='p2p-v2-my-ads-table-row__line-methods gap-2'>
                    {payment_method_names?.map(paymentMethod => (
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
                {min_order_amount_display} - {max_order_amount_display} {account_currency}
            </Text>
            <Text className='p2p-v2-my-ads-table-row__rate' size='sm'>
                {displayEffectiveRate} {local_currency}
                {rate_type === RATE_TYPE.FLOAT && <AdType adPauseColor={adPauseColor} floatRate={rate_display} />}
            </Text>
            <Text className='p2p-v2-my-ads-table-row__available' size='sm'>
                <ProgressIndicator
                    className={'p2p-v2-my-ads-table-row__available-progress'}
                    total={amount}
                    value={remaining_amount}
                />
                {remaining_amount_display}/{amount_display} {account_currency}
            </Text>
            <div className='flex flex-wrap gap-2'>
                {payment_method_names?.map(paymentMethod => (
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
                        <Button onClick={() => onClickActionItem(is_active ? 'deactivate' : 'activate')}>
                            <Tooltip message={is_active ? 'Deactivate' : 'Activate'} position='bottom'>
                                {is_active ? <DeactivateIcon /> : <ActivateIcon />}
                            </Tooltip>
                        </Button>
                        <Button onClick={() => onClickActionItem('edit')}>
                            <Tooltip message='Edit' position='bottom'>
                                <EditIcon />
                            </Tooltip>
                        </Button>
                        <Button onClick={() => onClickActionItem('delete')}>
                            <Tooltip message='Delete' position='bottom'>
                                <DeleteIcon />
                            </Tooltip>
                        </Button>
                        <Button onClick={() => onClickActionItem('share')}>
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
