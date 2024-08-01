import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { ActionSheet, TextField } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { useTraderStore } from 'Stores/useTraderStores';
import Carousel from 'AppV2/Components/Carousel';
import BarrierHeader from './barrier-header';
import BarrierDescription from './barrier-description';
import BarrierInput from './barrier-input';

type TDurationProps = {
    is_minimized?: boolean;
};

const Barrier = observer(({ is_minimized }: TDurationProps) => {
    const { barrier_1, onChange } = useTraderStore();
    const [is_open, setIsOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [initialBarrierValue, setInitialBarrierValue] = React.useState('');

    const barrier_carousel_pages = [
        {
            id: 1,
            component: <BarrierInput setInitialBarrierValue={setInitialBarrierValue} />,
        },
        {
            id: 2,
            component: <BarrierDescription />,
        },
    ];

    const onClose = (is_saved = false) => {
        if (is_open) {
            if (!is_saved) {
                onChange({ target: { name: 'barrier_1', value: initialBarrierValue } });
            }
            setIsOpen(false);
        }
    };

    return (
        <>
            <TextField
                variant='fill'
                readOnly
                label={<Localize i18n_default_text='Barrier' key={`barrier${is_minimized ? '-minimized' : ''}`} />}
                value={barrier_1}
                onClick={() => setIsOpen(true)}
                className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
            />
            <ActionSheet.Root isOpen={is_open} onClose={() => onClose(false)} position='left' expandable={false}>
                <ActionSheet.Portal shouldCloseOnDrag>
                    <Carousel
                        current_index={currentPage}
                        setCurrentIndex={setCurrentPage}
                        header={BarrierHeader}
                        pages={barrier_carousel_pages}
                    />
                    <ActionSheet.Footer
                        alignment='vertical'
                        shouldCloseOnPrimaryButtonClick={false}
                        primaryAction={
                            currentPage == 0
                                ? {
                                      content: <Localize i18n_default_text='Save' />,
                                      onAction: () => onClose(true),
                                  }
                                : {
                                      content: <Localize i18n_default_text='Got it' />,
                                      onAction: () => setCurrentPage(0),
                                  }
                        }
                    />
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </>
    );
});

export default Barrier;
