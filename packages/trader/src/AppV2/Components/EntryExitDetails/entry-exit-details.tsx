import { Text, CaptionText } from '@deriv-com/quill-ui';
import CardWrapper from '../CardWrapper';
import React, { useMemo } from 'react';
import { TContractInfo, addComma, getEndTime } from '@deriv/shared';
import { Localize } from '@deriv/translations';

const getDateTimeFromEpoch = (epoch?: number) => {
    if (epoch) {
        const date = new Date(epoch * 1000);
        const formattedDate = date.toUTCString().split(' ').slice(0, 4).join(' ');
        const formattedTime = `${date.toUTCString().split(' ')[4]} GMT`;
        return {
            date: formattedDate,
            time: formattedTime,
        };
    }
};

const DateTimeRow = ({ label, value, date, time }: { label: string; value?: string; date: string; time: string }) => (
    <div className='entry-exit-details__table-row'>
        <div className='entry-exit-details__table-cell'>
            <Text size='sm' color='quill-typography__color--subtle'>
                <Localize i18n_default_text={label} />
                {label}
            </Text>
        </div>
        <div className='entry-exit-details__table-cell'>
            <Text size='sm'>
                <Localize i18n_default_text={value} />
            </Text>
            <Text size='sm' color='quill-typography__color--subtle'>
                <Localize i18n_default_text={date} />
            </Text>
            <CaptionText color='quill-typography__color--subtle'>
                <Localize i18n_default_text={time} />
            </CaptionText>
        </div>
    </div>
);

const EntryExitDetails = ({ contract_info }: { contract_info: TContractInfo }) => {
    const { entry_tick_time, entry_spot_display_value, exit_tick_time, date_start, exit_tick_display_value } =
        contract_info;

    const dateTimes = useMemo(
        () => ({
            entry: entry_tick_time && getDateTimeFromEpoch(entry_tick_time),
            exit: exit_tick_time && getDateTimeFromEpoch(exit_tick_time),
            start: date_start && getDateTimeFromEpoch(date_start),
            end: getEndTime(contract_info) && getDateTimeFromEpoch(getEndTime(contract_info)),
        }),
        [contract_info]
    );

    const entryValue = entry_spot_display_value ? addComma(entry_spot_display_value) : null;
    const exitValue = exit_tick_display_value ? addComma(exit_tick_display_value) : null;

    return (
        <CardWrapper title='Entry & exit details' className='entry-exit-details'>
            <div className='entry-exit-details__table'>
                {dateTimes.start && <DateTimeRow label='Start time' {...dateTimes.start} />}
                {dateTimes.entry && entryValue && (
                    <DateTimeRow label='Entry spot' value={entryValue} {...dateTimes.entry} />
                )}
                {dateTimes.end && <DateTimeRow label='Exit time' {...dateTimes.end} />}
                {dateTimes.exit && exitValue && <DateTimeRow label='Exit spot' value={exitValue} {...dateTimes.exit} />}
            </div>
        </CardWrapper>
    );
};

export default EntryExitDetails;
