import React, { useMemo } from 'react';
import { TContractInfo, addComma, formatDate, formatTime, getEndTime } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import EntryExitDetailRow from './entry-exit-details-row';
import CardWrapper from '../CardWrapper';
import moment from 'moment';

const getDateTimeFromEpoch = (epoch: number) => {
    if (epoch) {
        const date = new Date(epoch * 1000);
        const momentDate = moment(date);
        const formattedDate = formatDate(momentDate, 'DD MMM YYYY');
        const formattedTime = formatTime(epoch, 'HH:mm:ss [GMT]');

        return {
            date: formattedDate,
            time: formattedTime,
        };
    }
};

const EntryExitDetails = ({ contract_info }: { contract_info: TContractInfo }) => {
    const { entry_tick_time, entry_spot_display_value, exit_tick_time, date_start, exit_tick_display_value } =
        contract_info;

    const dateTimes = useMemo(
        () => ({
            entry: entry_tick_time ? getDateTimeFromEpoch(entry_tick_time) : undefined,
            exit: exit_tick_time ? getDateTimeFromEpoch(exit_tick_time) : undefined,
            start: date_start ? getDateTimeFromEpoch(date_start) : undefined,
            end: getEndTime(contract_info) ? getDateTimeFromEpoch(getEndTime(contract_info) ?? 0) : undefined,
        }),
        [contract_info]
    );

    const entryValue = entry_spot_display_value ? addComma(entry_spot_display_value) : null;
    const exitValue = exit_tick_display_value ? addComma(exit_tick_display_value) : null;

    return (
        <CardWrapper title={<Localize i18n_default_text='Entry & exit details' />} className='entry-exit-details'>
            <div className='entry-exit-details__table'>
                {dateTimes.start && (
                    <EntryExitDetailRow
                        label={<Localize i18n_default_text='Start time' />}
                        value={dateTimes.start.date}
                        time={dateTimes.start.time}
                    />
                )}
                {dateTimes.entry && entryValue && (
                    <EntryExitDetailRow
                        label={<Localize i18n_default_text='Entry spot' />}
                        value={entryValue}
                        {...dateTimes.entry}
                    />
                )}
                {dateTimes.end && (
                    <EntryExitDetailRow
                        label={<Localize i18n_default_text='Exit time' />}
                        value={dateTimes.end.date}
                        time={dateTimes.end.time}
                    />
                )}
                {dateTimes.exit && exitValue && (
                    <EntryExitDetailRow
                        label={<Localize i18n_default_text='Exit spot' />}
                        value={exitValue}
                        {...dateTimes.exit}
                    />
                )}
            </div>
        </CardWrapper>
    );
};

export default EntryExitDetails;
