import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import Carousel from 'AppV2/Components/Carousel';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import StrikeDescription from './strike-description';
import StrikeWheel from './strike-wheel';

type TStrikeProps = {
    is_minimized?: boolean;
};

const Strike = observer(({ is_minimized }: TStrikeProps) => {
    const [is_open, setIsOpen] = React.useState(false);
    const { barrier_1, barrier_choices: strike_price_choices, onChange } = useTraderStore();

    const is_small_screen_device = window.innerHeight <= 640;
    const strike_price_list = strike_price_choices.map((strike_price: string) => ({
        value: strike_price,
    }));
    const onStrikePriceSelect = React.useCallback((e: Parameters<typeof onChange>[0]) => onChange(e), [onChange]);
    const action_sheet_content = [
        {
            id: 1,
            component: (
                <StrikeWheel
                    current_strike={barrier_1}
                    is_small_screen_device={is_small_screen_device}
                    onStrikePriceSelect={onStrikePriceSelect}
                    strike_price_list={strike_price_list}
                />
            ),
        },
        {
            id: 2,
            component: <StrikeDescription is_small_screen_device={is_small_screen_device} />,
        },
    ];

    return (
        <React.Fragment>
            <TextField
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                label={<Localize i18n_default_text='Strike price' key={`strike${is_minimized ? '-minimized' : ''}`} />}
                onClick={() => setIsOpen(true)}
                readOnly
                variant='fill'
                value={barrier_1}
            />
            <ActionSheet.Root isOpen={is_open} onClose={() => setIsOpen(false)} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag fullHeightOnOpen={is_small_screen_device}>
                    <Carousel
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
