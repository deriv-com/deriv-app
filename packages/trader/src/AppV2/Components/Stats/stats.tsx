import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { LabelPairedChevronDownSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';

const AccumulatorStats = () => {
    const { ticks_history_stats = {} } = useTraderStore();
    const [is_open, setIsOpen] = React.useState(false);
    const [is_open_description, setIsOpenDescription] = React.useState(false);
    const ticks_history = ticks_history_stats?.ticks_stayed_in ?? [];
    const rows = ticks_history.reduce((acc: number[][], _el, index) => {
        const row_size = 5;
        if (index % row_size === 0) {
            acc.push(ticks_history.slice(index, index + row_size));
        }
        return acc;
    }, []);

    const onActionSheetClose = () => {
        setIsOpen(false);
        setIsOpenDescription(false);
    };

    if (rows.length == 0) {
        return <></>;
    }

    return (
        <React.Fragment>
            <div className='accumulators-stats'>
                <div className='accumulators-stats__container'>
                    <div className='accumulators-stats__container__heading' onClick={() => setIsOpenDescription(true)}>
                        <Text size='sm'>
                            <Localize i18n_default_text='Stats' />
                        </Text>
                    </div>
                    <div className='accumulators-stats__container__divider' />
                    <div className='accumulators-stats__container__stats'>
                        {rows[0].concat(rows[1])?.map((el, i) => (
                            <div key={i} className='accumulators-stats__container__stats__stat'>
                                <Text size='sm'>{el}</Text>
                            </div>
                        ))}
                    </div>
                    <div className='accumulators-stats__container__expand' onClick={() => setIsOpen(true)}>
                        <LabelPairedChevronDownSmBoldIcon />
                    </div>
                </div>
            </div>
            <ActionSheet.Root
                isOpen={is_open || is_open_description}
                onClose={onActionSheetClose}
                position='left'
                expandable={false}
            >
                {is_open && (
                    <ActionSheet.Portal shouldCloseOnDrag>
                        <div className='stats-sheet'>
                            <div className='stats-sheet__title'>
                                <Text size='lg' bold>
                                    <Localize i18n_default_text='Stats' />
                                </Text>
                            </div>
                            <div className='stats-sheet__caption'>
                                <Text size='md'>
                                    <Localize i18n_default_text='History of tick counts' />
                                </Text>
                            </div>
                            {rows.map((item, index) => (
                                <div key={index} className='stats-sheet__stats'>
                                    {item.map((item, innerIndex) => (
                                        <Text key={innerIndex} size='sm'>
                                            {item}
                                        </Text>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </ActionSheet.Portal>
                )}
                {is_open_description && (
                    <ActionSheet.Portal showHandlebar={false}>
                        <div className='stats-description'>
                            <div className='stats-description__placeholder' />
                            <div className='stats-description__content'>
                                <div className='stats-description__content__title'>
                                    <Text size='lg' bold>
                                        <Localize i18n_default_text='Stats' />
                                    </Text>
                                </div>
                                <div className='stats-description__content__description'>
                                    <Text size='md'>
                                        <Localize i18n_default_text='Stats show the history of consecutive tick counts, i.e. the number of ticks the price remained within range continuously.' />
                                    </Text>
                                </div>
                            </div>
                        </div>
                        <ActionSheet.Footer
                            alignment='vertical'
                            primaryAction={{
                                content: <Localize i18n_default_text='Got it' />,
                                onAction: () => {},
                            }}
                        />
                    </ActionSheet.Portal>
                )}
            </ActionSheet.Root>
        </React.Fragment>
    );
};

export default AccumulatorStats;
