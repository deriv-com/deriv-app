import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { ActionSheet, TextField, Tooltip } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import TakeProfitAndStopLossInput from '../RiskManagement/take-profit-and-stop-loss-input';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';
import { TTradeParametersProps } from '../trade-parameters';
import useTradeError from 'AppV2/Hooks/useTradeError';

const TakeProfit = observer(({ is_minimized }: TTradeParametersProps) => {
    const { currency, has_open_accu_contract, has_take_profit, is_market_closed, take_profit } = useTraderStore();
    const { is_error_matching_field: has_error } = useTradeError({ error_fields: ['take_profit'] });
    const [is_open, setIsOpen] = React.useState(false);

    const onActionSheetClose = React.useCallback(() => setIsOpen(false), []);

    const action_sheet_content = [
        {
            id: 1,
            component: <TakeProfitAndStopLossInput onActionSheetClose={onActionSheetClose} />,
        },
        {
            id: 2,
            component: (
                <TradeParamDefinition
                    description={
                        <Localize i18n_default_text='When your profit reaches or exceeds the set amount, your trade will be closed automatically.' />
                    }
                />
            ),
        },
    ];

    return (
        <React.Fragment>
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
                        className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                        disabled={has_open_accu_contract || is_market_closed}
                        label={
                            <Localize
                                i18n_default_text='Take profit'
                                key={`take-profit${is_minimized ? '-minimized' : ''}`}
                            />
                        }
                        onClick={() => setIsOpen(true)}
                        readOnly
                        variant='fill'
                        value={
                            has_take_profit && take_profit ? `${take_profit} ${getCurrencyDisplayCode(currency)}` : '-'
                        }
                        status={has_error ? 'error' : 'neutral'}
                    />
                </Tooltip>
            ) : (
                <TextField
                    className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                    disabled={has_open_accu_contract || is_market_closed}
                    label={
                        <Localize
                            i18n_default_text='Take profit'
                            key={`take-profit${is_minimized ? '-minimized' : ''}`}
                        />
                    }
                    onClick={() => setIsOpen(true)}
                    readOnly
                    variant='fill'
                    value={has_take_profit && take_profit ? `${take_profit} ${getCurrencyDisplayCode(currency)}` : '-'}
                    status={has_error ? 'error' : 'neutral'}
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
                        header={CarouselHeader}
                        pages={action_sheet_content}
                        title={<Localize i18n_default_text='Take profit' />}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default TakeProfit;
