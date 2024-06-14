import React, { useMemo } from 'react';
import { TContractInfo, addComma, getEndTime } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import EntryExitDetailRow from './entry-exit-details-row';
import CardWrapper from '../CardWrapper';

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
                {dateTimes.start && (
                    <EntryExitDetailRow label={<Localize i18n_default_text='Start time' />} {...dateTimes.start} />
                )}
                {dateTimes.entry && entryValue && (
                    <EntryExitDetailRow
                        label={<Localize i18n_default_text='Entry spot' />}
                        value={entryValue}
                        {...dateTimes.entry}
                    />
                )}
                {dateTimes.end && (
                    <EntryExitDetailRow label={<Localize i18n_default_text='Exit time' />} {...dateTimes.end} />
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
