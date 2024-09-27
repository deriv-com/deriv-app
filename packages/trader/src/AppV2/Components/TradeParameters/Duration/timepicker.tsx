import { CaptionText, Text, TimeWheelPickerContainer } from '@deriv-com/quill-ui';
import { setTime, toMoment } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { getClosestTimeToCurrentGMT } from 'AppV2/Utils/trade-params-utils';
import React from 'react';
import { getBoundaries } from 'Stores/Modules/Trading/Helpers/end-time';
import { useTraderStore } from 'Stores/useTraderStores';

const EndTimePicker = ({ end_time, setEndTime }: { end_time: string; setEndTime: (arg: string) => void }) => {
    const [current_gmt_time, setCurrentGmtTime] = React.useState<string>('');
    const { common } = useStore();
    const { server_time } = common;
    const { expiry_date, market_open_times, market_close_times } = useTraderStore();

    const moment_expiry_date = toMoment(expiry_date);
    const market_open_datetimes = market_open_times.map(open_time => setTime(moment_expiry_date.clone(), open_time));
    const market_close_datetimes = market_close_times.map(close_time =>
        setTime(moment_expiry_date.clone(), close_time)
    );
    const server_datetime = toMoment(server_time);
    const boundaries = getBoundaries(server_datetime.clone(), market_open_datetimes, market_close_datetimes);
    const adjusted_start_time =
        boundaries.start[0]?.clone().add(5, 'minutes').format('HH:mm') || getClosestTimeToCurrentGMT(5);

    React.useEffect(() => {
        const updateCurrentGmtTime = () => {
            const now = new Date();
            const gmt_time = now.toLocaleTimeString('en-GB', { timeZone: 'GMT', hour12: false });
            setCurrentGmtTime(gmt_time);
        };
        updateCurrentGmtTime();
        const interval = setInterval(updateCurrentGmtTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='duration-container__time-picker'>
            <TimeWheelPickerContainer
                is12Hour={false}
                startTimeIn24Format={adjusted_start_time}
                minutesInterval={5}
                selectedTime={end_time}
                setSelectedValue={val => setEndTime(val as string)}
                containerHeight='256px'
                hoursInterval={1}
            />
            <div className='duration-container__endtime'>
                <CaptionText color='quill-typography__color--subtle'>
                    <Localize i18n_default_text='Current time' />
                </CaptionText>
                <Text size='sm'>{`${current_gmt_time} GMT`}</Text>
            </div>
        </div>
    );
};

export default EndTimePicker;
