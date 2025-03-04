import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';
import { Skeleton } from '@deriv/components';
import { isSmallScreen } from 'AppV2/Utils/trade-params-utils';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';
import PayoutPerPointWheel from './payout-per-point-wheel';
import { TTradeParametersProps } from '../trade-parameters';

const PayoutPerPoint = observer(({ is_minimized }: TTradeParametersProps) => {
    const [is_open, setIsOpen] = React.useState(false);
    const { barrier_1, currency, is_market_closed, payout_choices, payout_per_point, setPayoutPerPoint } =
        useTraderStore();
    const is_small_screen = isSmallScreen();
    const currency_display_code = getCurrencyDisplayCode(currency);
    const payout_per_point_list = [...payout_choices]
        .sort((a, b) => Number(a) - Number(b))
        .map((payout_per_point: string) => ({
            value: payout_per_point,
            label: `${payout_per_point} ${currency_display_code}`,
        }));

    const onClose = React.useCallback(() => setIsOpen(false), []);

    const action_sheet_content = [
        {
            id: 1,
            component: (
                <PayoutPerPointWheel
                    barrier={barrier_1}
                    current_payout_per_point={payout_per_point}
                    is_open={is_open}
                    onPayoutPerPointSelect={
                        setPayoutPerPoint as React.ComponentProps<typeof PayoutPerPointWheel>['onPayoutPerPointSelect']
                    }
                    onClose={onClose}
                    payout_per_point_list={payout_per_point_list}
                />
            ),
        },
        {
            id: 2,
            component: (
                <TradeParamDefinition
                    description={
                        <Localize i18n_default_text='The amount you choose to receive at expiry for every point of change between the final price and the barrier.' />
                    }
                />
            ),
        },
    ];
    const classname = clsx('trade-params__option', is_minimized && 'trade-params__option--minimized');

    if (!payout_per_point)
        return (
            <div className={classname}>
                <Skeleton />
            </div>
        );

    return (
        <React.Fragment>
            <TextField
                disabled={is_market_closed}
                className={classname}
                label={
                    <Localize
                        i18n_default_text='Payout per point'
                        key={`payout-per-point${is_minimized ? '-minimized' : ''}`}
                    />
                }
                onClick={() => setIsOpen(true)}
                readOnly
                variant='fill'
                value={`${payout_per_point} ${currency_display_code}`}
            />
            <ActionSheet.Root
                isOpen={is_open}
                onClose={onClose}
                position='left'
                expandable={false}
                shouldBlurOnClose={is_open}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <div className='trade__parameter-tooltip-info trade__parameter-tooltip-info-large' />
                    <Carousel
                        classname={clsx(
                            'payout-per-point__carousel',
                            is_small_screen && 'payout-per-point__carousel--small'
                        )}
                        header={CarouselHeader}
                        pages={action_sheet_content}
                        title={<Localize i18n_default_text='Payout per point' />}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default PayoutPerPoint;
