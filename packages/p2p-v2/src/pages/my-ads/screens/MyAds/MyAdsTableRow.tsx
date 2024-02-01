import React, { memo, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useExchangeRateSubscription } from '@deriv/api';
import { Button, Text, Tooltip } from '@deriv-com/ui';
import { useDevice } from '../../../../hooks';
import { generateEffectiveRate } from '../../../../utils/format-value';
import DeactivateIcon from '../../../../public/ic-archive.svg';
import ActivateIcon from '../../../../public/ic-unarchive.svg';
import EditIcon from '../../../../public/ic-edit.svg';
import DeleteIcon from '../../../../public/ic-delete.svg';
import { PopoverDropdown } from '../../../../components';
import { ADVERT_TYPE, RATE_TYPE } from '../../../../utils/constants';
import { formatMoney } from '../../../../utils/currency';
import AdStatus from './AdStatus';
import AdType from './AdType';
import { TMyAdsTableRowRendererProps } from './MyAdsTable';
import ProgressIndicator from './ProgressIndicator';
import './MyAdsTableRow.scss';

const BASE_CURRENCY = 'USD';
const list = [
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete' },
    { label: 'Duplicate', value: 'duplicate' },
    { label: 'Share', value: 'share' },
    { label: 'Deactivate', value: 'deactivate' },
];

const MyAdsTableRow = ({ isBarred, isListed, onClickIcon, ...rest }: TMyAdsTableRowRendererProps) => {
    const { isDesktop } = useDevice();
    const { data: exchangeRateValue, subscribe } = useExchangeRateSubscription();

    const {
        account_currency,
        amount,
        amount_display,
        effective_rate,
        id,
        is_active,
        local_currency,
        max_order_amount_display,
        min_order_amount_display,
        payment_method_names,
        price_display,
        rate_display,
        rate_type,
        remaining_amount,
        remaining_amount_display,
        type,
    } = rest;

    useEffect(() => {
        subscribe({
            base_currency: BASE_CURRENCY,
            target_currency: local_currency!,
        });
    }, [local_currency]);

    const [isActionsVisible, setIsActionsVisible] = useState(false);
    const isAdvertListed = isListed && !isBarred;
    const adPauseColor = isAdvertListed ? 'general' : 'less-prominent';
    const amountDealt = amount! - remaining_amount!;

    const exchangeRate = exchangeRateValue?.rates?.[local_currency!];

    const { displayEffectiveRate } = generateEffectiveRate({
        price: Number(price_display),
        rateType: rate_type,
        rate: Number(rate_display),
        localCurrency: local_currency,
        exchangeRate,
        marketRate: Number(effective_rate),
    });

    const advertType = type === 'buy' ? ADVERT_TYPE.BUY : ADVERT_TYPE.SELL;

    if (!isDesktop) {
        return (
            <div
                className={clsx('p2p-v2-my-ads-table-row__line', {
                    'p2p-v2-my-ads-table-row__line-disabled': !is_active,
                })}
            >
                <Text color='less-prominent' size='2xs'>
                    {`Ad ID ${id} `}
                </Text>
                <div className='p2p-v2-my-ads-table-row__line__type-and-status'>
                    <Text color={adPauseColor} weight='bold'>
                        {advertType} {account_currency}
                    </Text>
                    <div className='p2p-v2-my-ads-table-row__line__type-and-status__wrapper'>
                        <AdStatus isActive={!!is_active && !isBarred} />
                        <PopoverDropdown dropdownList={list} />
                    </div>
                </div>
                <div className='p2p-v2-my-ads-table-row__line-details'>
                    <Text size='2xs'>
                        {`${formatMoney(account_currency!, amountDealt, true)}`} {account_currency}&nbsp;
                        {advertType === 'Buy' ? 'Bought' : 'Sold'}
                    </Text>
                    <Text color='less-prominent' size='2xs'>
                        {amount_display} {account_currency}
                    </Text>
                </div>
                <ProgressIndicator
                    className={'p2p-v2-my-ads-table-row__available-progress'}
                    total={amount!}
                    value={amountDealt}
                />
                <div className='p2p-v2-my-ads-table-row__line-details'>
                    <Text color='less-prominent'>Limits</Text>
                    <Text color='less-prominent' size='2xs'>
                        {`Rate (1 ${account_currency})`}
                    </Text>
                </div>
                <div className='p2p-v2-my-ads-table-row__line-details'>
                    <Text color={adPauseColor} size='2xs'>
                        {min_order_amount_display} - {max_order_amount_display} {account_currency}
                    </Text>
                    <Text size='xs' weight='bold'>
                        <div className='display-layout'>
                            {displayEffectiveRate} {local_currency}
                            {rate_type === RATE_TYPE.FLOAT && (
                                <AdType adPauseColor={adPauseColor} floatRate={rate_display!} />
                            )}
                        </div>
                    </Text>
                </div>
                <div className='p2p-v2-my-ads-table-row__line-methods'>
                    {payment_method_names?.map(payment_method => (
                        <div className='p2p-v2-my-ads-table-row__payment-method--label' key={payment_method}>
                            <Text color={adPauseColor} size='2xs'>
                                {payment_method}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className={clsx('p2p-v2-my-ads-table-row__line', { 'p2p-v2-my-ads-table-row__line-disabled': !is_active })}
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
                {rate_type === RATE_TYPE.FLOAT && <AdType adPauseColor={adPauseColor} floatRate={rate_display!} />}
            </Text>
            <Text className='p2p-v2-my-ads-table-row__available' size='sm'>
                <ProgressIndicator
                    className={'p2p-v2-my-ads-table-row__available-progress'}
                    total={amount!}
                    value={remaining_amount!}
                />
                {remaining_amount_display}/{amount_display} {account_currency}
            </Text>
            <div className='p2p-v2-my-ads-table-row__payment-method'>
                {payment_method_names?.map(paymentMethod => (
                    <div className='p2p-v2-my-ads-table-row__payment-method--label' key={paymentMethod}>
                        <Text color={adPauseColor} size='xs'>
                            {paymentMethod}
                        </Text>
                    </div>
                ))}
            </div>
            <div className='p2p-v2-my-ads-table-row__actions'>
                {isActionsVisible ? (
                    <div className='p2p-v2-my-ads-table-row__actions-icons'>
                        <Button onClick={() => onClickIcon(id!, is_active ? 'deactivate' : 'activate')}>
                            <Tooltip message='Edit' position='bottom'>
                                {is_active ? <DeactivateIcon /> : <ActivateIcon />}
                            </Tooltip>
                        </Button>
                        <Button onClick={() => onClickIcon(id!, 'edit')}>
                            <Tooltip message={is_active ? 'Deactivate' : 'Activate'} position='bottom'>
                                <EditIcon />
                            </Tooltip>
                        </Button>
                        <Button onClick={() => onClickIcon(id!, 'delete')}>
                            <Tooltip message='Delete' position='bottom'>
                                <DeleteIcon />
                            </Tooltip>
                        </Button>
                    </div>
                ) : (
                    <AdStatus isActive={is_active} />
                )}
            </div>
        </div>
    );
};

export default memo(MyAdsTableRow);
