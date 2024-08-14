import React, { useEffect, useMemo, useState } from 'react';
import { ActionSheet, Text } from '@deriv-com/quill-ui';
import { LabelPairedChevronDownSmBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import StatsRow from './accumulator-stats-row';

const AccumulatorStats = observer(() => {
    const { ticks_history_stats = {} } = useTraderStore();
    const [is_open, setIsOpen] = useState(false);
    const [is_open_description, setIsOpenDescription] = useState(false);

    const ticks_history = useMemo(() => {
        return ticks_history_stats?.ticks_stayed_in ?? [];
    }, [ticks_history_stats]);

    const [animationClass, setAnimationClass] = useState('');
    const [lastValue, setLastValue] = useState<number | null>(null);
    const [isMovingTransition, setIsMovingTransition] = useState(false);

    const rows: number[][] = useMemo(() => {
        const row_size = 5;
        return ticks_history.reduce<number[][]>((acc, _el, index) => {
            if (index % row_size === 0) {
                acc.push(ticks_history.slice(index, index + row_size));
            }
            return acc;
        }, []);
    }, [ticks_history]);

    const onActionSheetClose = () => {
        setIsOpen(false);
        setIsOpenDescription(false);
    };

    useEffect(() => {
        if (rows[0] && rows[0].length > 0) {
            setAnimationClass('');
            if (lastValue && lastValue === rows[0][1]) {
                setTimeout(() => {
                    setAnimationClass('animate-error');
                }, 0);
            } else {
                setTimeout(() => {
                    setAnimationClass('animate-success');
                }, 0);
            }

            if (lastValue === rows[0][1]) {
                setIsMovingTransition(true);
                setTimeout(() => setIsMovingTransition(false), 600);
            } else {
                setIsMovingTransition(false);
            }
            setLastValue(rows[0][0]);
        }
    }, [rows[0]?.[0]]);

    if (rows.length === 0) {
        return null;
    }
    return (
        <div>
            <div className='accumulators-stats'>
                <div className='accumulators-stats__container'>
                    <button
                        className='accumulators-stats__container__heading'
                        onClick={() => setIsOpenDescription(true)}
                    >
                        <Text size='sm'>
                            <Localize i18n_default_text='Stats' />
                        </Text>
                    </button>
                    <div className='accumulators-stats__container__divider' />
                    <div className='accumulators-stats__container__stats'>
                        <StatsRow
                            rows={[...rows[0], ...(rows[1] || [])]}
                            animationClass={animationClass}
                            isMovingTransition={isMovingTransition}
                            className='accumulators-stats__container__stats'
                        />
                    </div>
                    <button className='accumulators-stats__container__expand' onClick={() => setIsOpen(true)}>
                        <LabelPairedChevronDownSmBoldIcon data-testid='expand-stats-icon' />
                    </button>
                </div>
            </div>
            <ActionSheet.Root
                isOpen={is_open || is_open_description}
                onClose={onActionSheetClose}
                position='left'
                className='accumulator-stats-sheet-wrapper'
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

                            <div className='stats-sheet__stats'>
                                <StatsRow
                                    rows={rows[0]}
                                    animationClass={animationClass}
                                    isMovingTransition={isMovingTransition}
                                    className='stats-sheet__stats'
                                />
                            </div>
                            {rows.slice(1).map((item, index) => (
                                <div key={index} className='stats-sheet__stats'>
                                    {item.map((item: number, innerIndex: number) => (
                                        <div key={`${index}-${innerIndex}`} className='stats-sheet__stats__number'>
                                            <Text size='sm'>{item}</Text>
                                        </div>
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
                                onAction: onActionSheetClose,
                            }}
                        />
                    </ActionSheet.Portal>
                )}
            </ActionSheet.Root>
        </div>
    );
});

export default AccumulatorStats;
