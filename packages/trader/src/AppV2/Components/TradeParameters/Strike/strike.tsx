import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { getCurrencyDisplayCode, isEmptyObject } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Skeleton } from '@deriv/components';
import TradeParamDefinition from 'AppV2/Components/TradeParamDefinition';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import { isSmallScreen } from 'AppV2/Utils/trade-params-utils';
import StrikeWheel from './strike-wheel';
import { TTradeParametersProps } from '../trade-parameters';

const Strike = observer(({ is_minimized, is_disabled }: TTradeParametersProps) => {
    const [is_open, setIsOpen] = React.useState(false);
    const {
        barrier_1,
        barrier_choices: strike_price_choices,
        contract_type,
        currency,
        onChange,
        proposal_info,
        setV2ParamsInitialValues,
        v2_params_initial_values,
    } = useTraderStore();

    const is_small_screen = isSmallScreen();
    const strike_price_list = strike_price_choices.map((strike_price: string) => ({ value: strike_price }));
    const payout_per_point: string | number = isEmptyObject(proposal_info)
        ? ''
        : proposal_info[contract_type.toUpperCase()]?.obj_contract_basis?.value;

    const handleStrikeChange = (new_value: number | string) =>
        onChange({ target: { name: 'barrier_1', value: new_value } });

    const action_sheet_content = [
        {
            id: 1,
            component: (
                <StrikeWheel
                    current_strike={barrier_1}
                    currency={getCurrencyDisplayCode(currency)}
                    onStrikePriceSelect={handleStrikeChange}
                    payout_per_point={payout_per_point}
                    strike_price_list={strike_price_list}
                    setV2ParamsInitialValues={setV2ParamsInitialValues}
                />
            ),
        },
        {
            id: 2,
            component: (
                <TradeParamDefinition
                    description={
                        <>
                            <p>
                                <Localize i18n_default_text='It is the price where you can start receiving a payout from an option.' />
                            </p>
                            <br />
                            <p>
                                <Localize i18n_default_text='For a Call option, you receive a payout if the final price is higher than the strike price.' />
                            </p>
                            <br />
                            <p>
                                <Localize i18n_default_text='For a Put option, you receive a payout if the final price is lower than the strike price.' />
                            </p>
                        </>
                    }
                />
            ),
        },
    ];
    const classname = clsx('trade-params__option', is_minimized && 'trade-params__option--minimized');

    React.useEffect(() => {
        const initial_strike = v2_params_initial_values?.strike;
        if (initial_strike && barrier_1 !== initial_strike) {
            handleStrikeChange(initial_strike);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!barrier_1)
        return (
            <div className={classname}>
                <Skeleton />
            </div>
        );

    return (
        <React.Fragment>
            <TextField
                className={classname}
                disabled={is_disabled}
                label={<Localize i18n_default_text='Strike price' key={`strike${is_minimized ? '-minimized' : ''}`} />}
                onClick={() => setIsOpen(true)}
                readOnly
                variant='fill'
                value={barrier_1}
            />
            <ActionSheet.Root isOpen={is_open} onClose={() => setIsOpen(false)} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <Carousel
                        classname={clsx('strike__carousel', is_small_screen && 'strike__carousel--small')}
                        header={CarouselHeader}
                        pages={action_sheet_content}
                        title={<Localize i18n_default_text='Strike price' />}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default Strike;
