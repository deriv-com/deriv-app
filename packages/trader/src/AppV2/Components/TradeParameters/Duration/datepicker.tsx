import { DatePicker } from '@deriv-com/quill-ui';
import { toMoment, useIsMounted } from '@deriv/shared';
import React, { useEffect } from 'react';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { useTraderStore } from 'Stores/useTraderStores';

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
            let new_disabled_days: number[] = [];
            const events = await ContractType.getTradingEvents(e, symbol);
            events?.forEach(evt => {
                const dates = evt.dates.split(', ');
                const idx = dates.indexOf('Fridays');
                if (idx !== -1) {
                    new_disabled_days = [6, 0];
                }
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
