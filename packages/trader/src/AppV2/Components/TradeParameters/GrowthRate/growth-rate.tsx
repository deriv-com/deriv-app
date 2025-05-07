import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { ActionSheet, TextField, Tooltip } from '@deriv-com/quill-ui';
import { Skeleton } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { CONTRACT_TYPES, getGrowthRatePercentage, isEmptyObject } from '@deriv/shared';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';
import { isSmallScreen } from 'AppV2/Utils/trade-params-utils';
import GrowthRatePicker from './growth-rate-picker';
import { TTradeParametersProps } from '../trade-parameters';

const GrowthRate = observer(({ is_minimized }: TTradeParametersProps) => {
    const {
        accumulator_range_list,
        growth_rate,
        is_purchase_enabled,
        is_trade_enabled,
        is_market_closed,
        has_open_accu_contract,
        maximum_ticks,
        onChange,
        proposal_info,
        setV2ParamsInitialValues,
        tick_size_barrier_percentage,
        v2_params_initial_values,
    } = useTraderStore();

    const [is_open, setIsOpen] = React.useState(false);
    const is_small_screen = isSmallScreen();
    const info = proposal_info?.[CONTRACT_TYPES.ACCUMULATOR] || {};
    const is_proposal_data_available =
        is_trade_enabled && !isEmptyObject(proposal_info) && !!info.id && is_purchase_enabled;
    const classname = clsx('trade-params__option', is_minimized && 'trade-params__option--minimized');

    const handleGrowthRateChange = (rate: number) => {
        onChange({ target: { name: 'growth_rate', value: rate } });
    };
    const onActionSheetClose = React.useCallback(() => setIsOpen(false), []);

    const action_sheet_content = [
        {
            id: 1,
            component: (
                <GrowthRatePicker
                    accumulator_range_list={accumulator_range_list}
                    maximum_ticks={maximum_ticks}
                    growth_rate={growth_rate}
                    setGrowthRate={handleGrowthRateChange}
                    setV2ParamsInitialValues={setV2ParamsInitialValues}
                    should_show_details={is_proposal_data_available}
                    tick_size_barrier_percentage={tick_size_barrier_percentage}
                />
            ),
        },
        {
            id: 2,
            component: (
                <TradeParamDefinition
                    description={
                        <Localize
                            i18n_default_text='Your stake will grow at {{growth_rate}}% per tick as long as the current spot price remains within ±{{tick_size_barrier_percentage}} from the previous spot price.'
                            values={{
                                growth_rate: getGrowthRatePercentage(growth_rate),
                                tick_size_barrier_percentage,
                            }}
                        />
                    }
                />
            ),
        },
    ];

    React.useEffect(() => {
        const initial_growth_rate = v2_params_initial_values?.growth_rate;
        if (initial_growth_rate && growth_rate !== initial_growth_rate) handleGrowthRateChange(initial_growth_rate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!growth_rate)
        return (
            <div className={classname}>
                <Skeleton />
            </div>
        );
    return (
        <>
            {has_open_accu_contract ? (
                <Tooltip
                    tooltipContent={
                        <Localize i18n_default_text='Parameters are disabled when you have an open position.' />
                    }
                    tooltipPosition={is_minimized ? 'top' : 'bottom'}
                    variant='base'
                    hasArrow={true}
                >
                    <TextField
                        className={classname}
                        disabled={has_open_accu_contract || is_market_closed}
                        label={
                            <Localize
                                i18n_default_text='Growth rate'
                                key={`growth-rate${is_minimized ? '-minimized' : ''}`}
                            />
                        }
                        onClick={() => setIsOpen(true)}
                        readOnly
                        value={`${getGrowthRatePercentage(growth_rate)}%`}
                        variant='fill'
                    />
                </Tooltip>
            ) : (
                <TextField
                    className={classname}
                    disabled={has_open_accu_contract || is_market_closed}
                    label={
                        <Localize
                            i18n_default_text='Growth rate'
                            key={`growth-rate${is_minimized ? '-minimized' : ''}`}
                        />
                    }
                    onClick={() => setIsOpen(true)}
                    readOnly
                    value={`${getGrowthRatePercentage(growth_rate)}%`}
                    variant='fill'
                />
            )}
            <ActionSheet.Root
                isOpen={is_open}
                onClose={onActionSheetClose}
                position='left'
                expandable={false}
                shouldBlurOnClose={is_open}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <Carousel
                        classname={clsx('growth-rate__carousel', is_small_screen && 'growth-rate__carousel--small')}
                        header={CarouselHeader}
                        pages={action_sheet_content}
                        title={<Localize i18n_default_text='Growth rate' />}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default GrowthRate;
