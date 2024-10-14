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
import { removeFocus } from 'AppV2/Utils/layout-utils';

type TTakeProfitProps = {
    is_minimized?: boolean;
};

const TakeProfit = observer(({ is_minimized }: TTakeProfitProps) => {
    const { currency, has_open_accu_contract, has_take_profit, take_profit } = useTraderStore();

    const [is_open, setIsOpen] = React.useState(false);

    const onActionSheetClose = () => setIsOpen(false);

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
                disabled={has_open_accu_contract}
                label={
                    <Localize i18n_default_text='Take profit' key={`take-profit${is_minimized ? '-minimized' : ''}`} />
                }
                onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
                    removeFocus(e);
                    setIsOpen(true);
                }}
                readOnly
                variant='fill'
                value={has_take_profit && take_profit ? `${take_profit} ${getCurrencyDisplayCode(currency)}` : '-'}
            />
            <ActionSheet.Root isOpen={is_open} onClose={onActionSheetClose} position='left' expandable={false}>
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
