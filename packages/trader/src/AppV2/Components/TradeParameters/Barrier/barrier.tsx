import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField, useSnackbar } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import Carousel from 'AppV2/Components/Carousel';
import BarrierDescription from './barrier-description';
import BarrierInput from './barrier-input';
import CarouselHeader from 'AppV2/Components/Carousel/carousel-header';
import { TTradeParametersProps } from '../trade-parameters';

const Barrier = observer(({ is_minimized }: TTradeParametersProps) => {
    const {
        barrier_1,
        duration_unit,
        is_market_closed,
        v2_params_initial_values,
        validation_errors,
        proposal_info,
        trade_type_tab,
    } = useTraderStore();
    const [is_open, setIsOpen] = React.useState(false);
    const [initialBarrierValue, setInitialBarrierValue] = React.useState('');
    const isDays = duration_unit == 'd';
    const has_error =
        validation_errors.barrier_1.length > 0 ||
        (proposal_info?.[trade_type_tab]?.has_error && proposal_info?.[trade_type_tab]?.error_field === 'barrier');
    const { addSnackbar } = useSnackbar();
    const [barrier_error_shown, setBarrierErrorShown] = React.useState(false);

    const onClose = React.useCallback(
        () => {
            if (is_open) {
                setIsOpen(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [initialBarrierValue, is_open]
    );

    React.useEffect(() => {
        const has_error = proposal_info?.[trade_type_tab]?.has_error;
        const error_field = proposal_info?.[trade_type_tab]?.error_field;
        const message = proposal_info?.[trade_type_tab]?.message;

        if (has_error && error_field === 'barrier' && !barrier_error_shown && !is_open && !is_minimized) {
            addSnackbar({
                message,
                hasCloseButton: true,
                status: 'fail',
                style: { marginBottom: '48px' },
            });
            setBarrierErrorShown(true);
        }
    }, [proposal_info]);

    React.useEffect(() => {
        if (is_open) {
            setBarrierErrorShown(false);
        }
    }, [is_open]);

    const barrier_carousel_pages = [
        {
            id: 1,
            component: <BarrierInput is_open={is_open} isDays={isDays} onClose={onClose} />,
        },
        {
            id: 2,
            component: <BarrierDescription isDays={isDays} />,
        },
    ];

    return (
        <>
            <TextField
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
                disabled={is_market_closed}
                variant='fill'
                readOnly
                noStatusIcon
                label={<Localize i18n_default_text='Barrier' key={`barrier${is_minimized ? '-minimized' : ''}`} />}
                value={v2_params_initial_values.barrier_1 || barrier_1}
                onClick={() => setIsOpen(true)}
                status={has_error && !is_open ? 'error' : undefined}
            />
            <ActionSheet.Root
                isOpen={is_open}
                onClose={onClose}
                position='left'
                expandable={false}
                shouldBlurOnClose={is_open}
            >
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
