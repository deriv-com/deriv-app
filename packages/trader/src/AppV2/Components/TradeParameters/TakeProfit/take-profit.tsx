import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import { getCurrencyDisplayCode } from '@deriv/shared';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import TakeProfitAndStopLossInput from '../RiskManagement/take-profit-and-stop-loss-input';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';
import { TTradeParametersProps } from '../trade-parameters';
import useTradeParamError from 'AppV2/Hooks/useTradeParamError';
import { getDisplayedContractTypes } from 'AppV2/Utils/trade-types-utils';

const TakeProfit = observer(({ is_minimized }: TTradeParametersProps) => {
    const {
        currency,
        contract_type,
        has_open_accu_contract,
        has_take_profit,
        is_market_closed,
        take_profit,
        trade_types,
        trade_type_tab,
        proposal_info,
        validation_errors,
    } = useTraderStore();
    const contract_type_object = getDisplayedContractTypes(trade_types, contract_type, trade_type_tab);

    const { is_error_matching_trade_param: has_error } = useTradeParamError({
        proposal_info,
        contract_type: contract_type_object[0],
        validation_errors,
        trade_params: ['take_profit'],
    });

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
            <TextField
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                disabled={has_open_accu_contract || is_market_closed}
                label={
                    <Localize i18n_default_text='Take profit' key={`take-profit${is_minimized ? '-minimized' : ''}`} />
                }
                onClick={() => setIsOpen(true)}
                readOnly
                variant='fill'
                value={has_take_profit && take_profit ? `${take_profit} ${getCurrencyDisplayCode(currency)}` : '-'}
                status={has_error ? 'error' : 'neutral'}
            />
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
