import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import Carousel from 'AppV2/Components/Carousel';
import BarrierDescription from './barrier-description';
import BarrierInput from './barrier-input';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import { removeFocus } from 'AppV2/Utils/layout-utils';

type TDurationProps = {
    is_minimized?: boolean;
};

const Barrier = observer(({ is_minimized }: TDurationProps) => {
    const { barrier_1, onChange, duration_unit, setV2ParamsInitialValues, v2_params_initial_values } = useTraderStore();
    const [is_open, setIsOpen] = React.useState(false);
    const [initialBarrierValue, setInitialBarrierValue] = React.useState('');
    const isDays = duration_unit == 'd';

    const onClose = (is_saved = false) => {
        if (is_open) {
            if (!is_saved) {
                onChange({ target: { name: 'barrier_1', value: initialBarrierValue } });
            }
            setV2ParamsInitialValues({ value: '', name: 'barrier_1' });
            setIsOpen(false);
        }
    };

    const barrier_carousel_pages = [
        {
            id: 1,
            component: (
                <BarrierInput isDays={isDays} setInitialBarrierValue={setInitialBarrierValue} onClose={onClose} />
            ),
        },
        {
            id: 2,
            component: <BarrierDescription isDays={isDays} />,
        },
    ];

    return (
        <>
            <TextField
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Barrier' key={`barrier${is_minimized ? '-minimized' : ''}`} />}
                value={v2_params_initial_values.barrier_1 || barrier_1}
                onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
                    removeFocus(e);
                    setIsOpen(true);
                }}
                onMouseDown={removeFocus}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
            />
            <ActionSheet.Root isOpen={is_open} onClose={() => onClose(false)} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <Carousel
                        header={CarouselHeader}
                        title={<Localize i18n_default_text='Barrier' />}
                        pages={barrier_carousel_pages}
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Barrier;
