import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { getCurrencyDisplayCode } from '@deriv/shared';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';
import { addUnit, isSmallScreen } from 'AppV2/Utils/trade-params-utils';
import RiskManagementPicker from './risk-management-picker';
import RiskManagementContent from './risk-management-content';
import { TTradeParametersProps } from '../trade-parameters';
import useTradeError from 'AppV2/Hooks/useTradeError';

const RiskManagement = observer(({ is_minimized }: TTradeParametersProps) => {
    const [is_open, setIsOpen] = React.useState(false);
    const {
        cancellation_range_list,
        cancellation_duration,
        currency,
        has_cancellation,
        has_take_profit,
        has_stop_loss,
        is_market_closed,
        take_profit,
        stop_loss,
    } = useTraderStore();

    const { is_error_matching_field: has_error } = useTradeError({
        error_fields: ['stop_loss', 'take_profit'],
    });

    const closeActionSheet = React.useCallback(() => setIsOpen(false), []);
    const getRiskManagementText = () => {
        if (has_cancellation) return `DC: ${addUnit({ value: cancellation_duration, unit: localize('minutes') })}`;
        if (has_take_profit && has_stop_loss)
            return `TP: ${take_profit} ${getCurrencyDisplayCode(currency)} / SL: ${stop_loss} ${getCurrencyDisplayCode(
                currency
            )}`;
        if (has_take_profit) return `TP: ${take_profit} ${getCurrencyDisplayCode(currency)}`;
        if (has_stop_loss) return `SL: ${stop_loss} ${getCurrencyDisplayCode(currency)}`;
        return '-';
    };

    const is_small_screen = isSmallScreen();
    const should_show_deal_cancellation = cancellation_range_list?.length > 0;
    const classname = clsx('trade-params__option', is_minimized && 'trade-params__option--minimized');
    const action_sheet_content = [
        {
            id: 1,
            component: (
                <RiskManagementPicker
                    closeActionSheet={closeActionSheet}
                    initial_tab_index={Number(has_cancellation)}
                    should_show_deal_cancellation={should_show_deal_cancellation}
                />
            ),
        },
        {
            id: 2,
            component: (
                <TradeParamDefinition
                    classname='risk-management__description'
                    description={
                        <RiskManagementContent should_show_deal_cancellation={should_show_deal_cancellation} />
                    }
                    is_custom_description
                />
            ),
        },
    ];

    return (
        <React.Fragment>
            <TextField
                className={classname}
                disabled={is_market_closed}
                label={
                    <Localize
                        i18n_default_text='Risk management'
                        key={`risk-management${is_minimized ? '-minimized' : ''}`}
                    />
                }
                onClick={() => setIsOpen(true)}
                readOnly
                value={getRiskManagementText()}
                variant='fill'
                status={has_error ? 'error' : 'neutral'}
            />
            <ActionSheet.Root
                isOpen={is_open}
                onClose={closeActionSheet}
                position='left'
                expandable={false}
                shouldBlurOnClose={is_open}
            >
                <ActionSheet.Portal shouldCloseOnDrag>
                    <div className='trade__parameter-tooltip-info trade__parameter-tooltip-info-large' />
                    <Carousel
                        classname={clsx(
                            'risk-management__carousel',
                            is_small_screen && 'risk-management__carousel--small'
                        )}
                        header={CarouselHeader}
                        pages={action_sheet_content}
                        title={<Localize i18n_default_text='Risk management' />}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default RiskManagement;
