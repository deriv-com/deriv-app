import { DatePicker } from '@deriv-com/quill-ui';
import { toMoment, useIsMounted } from '@deriv/shared';
import React, { useEffect } from 'react';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { useTraderStore } from 'Stores/useTraderStores';

type TMarketEvent = {
    dates: string[];
    descrip: string;
};

const DaysDatepicker = ({
    start_date,
    end_date,
    setEndDate,
}: {
    start_date: Date;
    setEndDate: (arg: Date) => void;
    end_date: Date;
}) => {
    const [disabled_days, setDisabledDays] = React.useState<number[]>([]);
    const { symbol } = useTraderStore();
    const isMounted = useIsMounted();

    const onChangeCalendarMonth = React.useCallback(
        async (e = toMoment().format('YYYY-MM-DD')) => {
            const new_market_events: TMarketEvent[] = [];
            let new_disabled_days: number[] = [];

            const [events, trading_days] = await Promise.all([
                ContractType.getTradingEvents(e, symbol),
                ContractType.getTradingDays(e, symbol),
            ]);

            if (trading_days) {
                const all_days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
                new_disabled_days = all_days
                    .map((day: (typeof all_days)[number], index) => (!trading_days.includes(day) ? index : -1))
                    .filter(index => index !== -1);
            }

            events?.forEach(evt => {
                const dates = evt.dates.split(', '); // convert dates str into array
                new_market_events.push({
                    dates,
                    descrip: evt.descrip,
                });
            });

            if (isMounted()) {
                setDisabledDays(new_disabled_days);
            }
        },
        [isMounted, symbol]
    );

    useEffect(() => {
        onChangeCalendarMonth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDisabledDays = ({ date }: { date: Date }) => {
        const day = date.getDay();
        return disabled_days.includes(day);
    };
    return (
        <div className='duration-datepicker duration-container__date-picker'>
            <DatePicker
                className='date-picker'
                hasFixedWidth={false}
                minDate={new Date(start_date)}
                maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                view='month'
                value={end_date}
                tileDisabled={getDisabledDays}
                onChange={date => {
                    if (date && date instanceof Date) {
                        setEndDate(date);
                    }
                }}
                wrapperClassName='duration-container__date-picker__sheet'
            />
        </div>
    );
};

export default DaysDatepicker;
