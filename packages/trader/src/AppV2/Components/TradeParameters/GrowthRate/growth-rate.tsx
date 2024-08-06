import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { CONTRACT_TYPES, getGrowthRatePercentage, isEmptyObject } from '@deriv/shared';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';
import GrowthRatePicker from './growth-rate-picker';

type TGrowthRateProps = {
    is_minimized?: boolean;
};

const GrowthRate = observer(({ is_minimized }: TGrowthRateProps) => {
    const {
        accumulator_range_list,
        growth_rate,
        is_purchase_enabled,
        is_trade_enabled,
        has_open_accu_contract,
        maximum_ticks,
        onChange,
        proposal_info,
        tick_size_barrier_percentage,
    } = useTraderStore();

    const [is_open, setIsOpen] = React.useState(false);
    const [selected_growth_rate, setSelectedGrowthRate] = React.useState(growth_rate);
    const is_small_screen = window.innerHeight <= 640;
    const info = proposal_info?.[CONTRACT_TYPES.ACCUMULATOR] || {};
    const is_proposal_data_available =
        is_trade_enabled && !isEmptyObject(proposal_info) && !!info.id && is_purchase_enabled;

    React.useEffect(() => {
        setSelectedGrowthRate(growth_rate);
    }, [growth_rate]);

    const handleGrowthRateChange = (rate: number) => {
        onChange({ target: { name: 'growth_rate', value: rate } });
    };
    const onSaveButtonClick = () => {
        if (growth_rate !== selected_growth_rate) handleGrowthRateChange(selected_growth_rate);
        onActionSheetClose();
    };
    const onActionSheetClose = () => {
        setIsOpen(false);
        setSelectedGrowthRate(growth_rate);
    };

    const action_sheet_content = [
        {
            id: 1,
            component: (
                <GrowthRatePicker
                    accumulator_range_list={accumulator_range_list}
                    maximum_ticks={maximum_ticks}
                    onSave={onSaveButtonClick}
                    growth_rate={selected_growth_rate}
                    setGrowthRate={handleGrowthRateChange}
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

    return (
        <>
            <TextField
                variant='fill'
                readOnly
                label={
                    <Localize i18n_default_text='Growth rate' key={`growth-rate${is_minimized ? '-minimized' : ''}`} />
                }
                value={`${getGrowthRatePercentage(growth_rate)}%`}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                disabled={has_open_accu_contract}
                onClick={() => setIsOpen(true)}
            />
            <ActionSheet.Root isOpen={is_open} onClose={onActionSheetClose} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag fullHeightOnOpen={is_small_screen}>
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
