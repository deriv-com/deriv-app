import { Text } from '@deriv-com/quill-ui';
import { LabelPairedChevronDownSmBoldIcon } from '@deriv/quill-icons';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import React from 'react';
import { useTraderStore } from 'Stores/useTraderStores';

export const ROW_SIZES = {
    DESKTOP_COLLAPSED: 10,
    DESKTOP_EXPANDED: 10,
    MOBILE_COLLAPSED: 15,
    MOBILE_EXPANDED: 5,
};

const AccumulatorStats = () => {
    const { ui } = useStore();
    const { ticks_history_stats = {} } = useTraderStore();
    const { is_mobile } = ui;

    const [is_collapsed, setIsCollapsed] = React.useState(true);
    const ticks_history = ticks_history_stats?.ticks_stayed_in ?? [];

    const rows = ticks_history.reduce((acc: number[][], _el, index) => {
        const mobile_row_size = is_collapsed ? ROW_SIZES.MOBILE_COLLAPSED : ROW_SIZES.MOBILE_EXPANDED;
        const row_size = mobile_row_size;
        if (index % row_size === 0) {
            acc.push(ticks_history.slice(index, index + row_size));
        }
        return acc;
    }, []);

    console.log(rows);

    return (
        <div className='accumulators-stats'>
            <div className='accumulators-stats__container'>
                <div className='accumulators-stats__container__heading'>
                    <Text size='sm'>
                        <Localize i18n_default_text='Stats' />
                    </Text>
                </div>
                <div className='accumulators-stats__container__divider' />
                <div className='accumulators-stats__container__stats'>
                    {rows[0]?.map((el, i) => (
                        <div key={i} className='accumulators-stats__container__stats__stat'>
                            <Text size='sm'>{el}</Text>
                        </div>
                    ))}
                </div>
                <div className='accumulators-stats__container__expand'>
                    <LabelPairedChevronDownSmBoldIcon />
                </div>
            </div>
        </div>
    );
};

export default AccumulatorStats;
