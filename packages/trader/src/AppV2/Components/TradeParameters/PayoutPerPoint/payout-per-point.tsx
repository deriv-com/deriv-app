import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
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

type TPayoutPerPointProps = {
    is_minimized?: boolean;
};

const PayoutPerPoint = observer(({ is_minimized }: TPayoutPerPointProps) => {
    const [is_open, setIsOpen] = React.useState(false);
    const {
        barrier_1,
        currency,
        payout_choices,
        payout_per_point,
        setPayoutPerPoint,
        setV2ParamsInitialValues,
        v2_params_initial_values,
    } = useTraderStore();

    const is_small_screen = isSmallScreen();
    const currency_display_code = getCurrencyDisplayCode(currency);
    const payout_per_point_list = [...payout_choices]
        .sort((a, b) => Number(a) - Number(b))
        .map((payout_per_point: string) => ({
            value: payout_per_point,
            label: `${payout_per_point} ${currency_display_code}`,
        }));

    const action_sheet_content = [
        {
            id: 1,
            component: (
                <PayoutPerPointWheel
                    current_payout_per_point={payout_per_point}
                    onPayoutPerPointSelect={
                        setPayoutPerPoint as React.ComponentProps<typeof PayoutPerPointWheel>['onPayoutPerPointSelect']
                    }
                    barrier={barrier_1}
                    payout_per_point_list={payout_per_point_list}
                    setV2ParamsInitialValues={setV2ParamsInitialValues}
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

    React.useEffect(() => {
        const initial_payout_per_point = v2_params_initial_values?.payout_per_point;
        if (initial_payout_per_point && payout_per_point !== initial_payout_per_point) {
            setPayoutPerPoint(initial_payout_per_point);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!payout_per_point)
        return (
            <div className={classname}>
                <Skeleton />
            </div>
        );

    return (
        <React.Fragment>
            <TextField
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
                value={`${v2_params_initial_values?.payout_per_point ?? payout_per_point} ${currency_display_code}`}
            />
            <ActionSheet.Root isOpen={is_open} onClose={() => setIsOpen(false)} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
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
