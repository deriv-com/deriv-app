import { Text, CaptionText } from '@deriv-com/quill-ui';
import CardWrapper from '../CardWrapper';
import React from 'react';
import { TContractInfo, addComma, getEndTime } from '@deriv/shared';

const getDateTimeFromEpoch = (epoch: number) => {
    const date = new Date(epoch * 1000);
    const formattedDate = date.toUTCString().split(' ').slice(0, 4).join(' ');
    const formattedTime = `${date.toUTCString().split(' ')[4]} GMT`;
    return {
        date: formattedDate,
        time: formattedTime,
    };
};

const EntryExitDetails = ({ contract_info }: { contract_info: TContractInfo }) => {
    const { entry_tick_time, entry_spot_display_value, exit_tick_time, date_start, exit_tick_display_value } =
        contract_info;
    const entryDisplayValue = entry_spot_display_value ? addComma(entry_spot_display_value) : null;
    const entrySpotDateTime = entry_tick_time ? getDateTimeFromEpoch(entry_tick_time) : null;
    const exitSpotDateTime = exit_tick_time ? getDateTimeFromEpoch(exit_tick_time) : null;
    const startDateTime = date_start ? getDateTimeFromEpoch(date_start) : null;
    const exitSpot = exit_tick_display_value ? addComma(exit_tick_display_value) : null;
    const endTime = getEndTime(contract_info);
    const exitDateTime = endTime ? getDateTimeFromEpoch(endTime) : null;

    return (
        <CardWrapper title='Entry & exit details' className='entry-exit-details'>
            <div className='entry-exit-details__table'>
                {startDateTime && (
                    <div className='entry-exit-details__table-row'>
                        <div className='entry-exit-details__table-cell'>
                            <Text size='sm' color='quill-typography__color--subtle'>
                                Start time
                            </Text>
                        </div>
                        <div className='entry-exit-details__table-cell'>
                            <Text size='sm'>{startDateTime.date}</Text>
                            <CaptionText color='quill-typography__color--subtle'>{startDateTime.time}</CaptionText>
                        </div>
                    </div>
                )}
                {entrySpotDateTime && entryDisplayValue && (
                    <div className='entry-exit-details__table-row'>
                        <div className='entry-exit-details__table-cell'>
                            <Text size='sm' color='quill-typography__color--subtle'>
                                Entry spot
                            </Text>
                        </div>
                        <div className='entry-exit-details__table-cell'>
                            <Text size='sm'>{entryDisplayValue}</Text>
                            <Text size='sm' color='quill-typography__color--subtle'>
                                {entrySpotDateTime.date}
                            </Text>
                            <CaptionText color='quill-typography__color--subtle'>{entrySpotDateTime.time}</CaptionText>
                        </div>
                    </div>
                )}
                {exitDateTime && (
                    <div className='entry-exit-details__table-row'>
                        <div className='entry-exit-details__table-cell'>
                            <Text size='sm' color='quill-typography__color--subtle'>
                                Exit time
                            </Text>
                        </div>
                        <div className='entry-exit-details__table-cell'>
                            <Text size='sm'>{exitDateTime.date}</Text>
                            <CaptionText color='quill-typography__color--subtle'>{exitDateTime.time}</CaptionText>
                        </div>
                    </div>
                )}
                {exitSpotDateTime && exitSpot && (
                    <div className='entry-exit-details__table-row'>
                        <div className='entry-exit-details__table-cell'>
                            <Text size='sm' color='quill-typography__color--subtle'>
                                Exit spot
                            </Text>
                        </div>
                        <div className='entry-exit-details__table-cell'>
                            <Text size='sm'>{exitSpot}</Text>
                            <Text size='sm' color='quill-typography__color--subtle'>
                                {exitSpotDateTime.date}
                            </Text>
                            <CaptionText color='quill-typography__color--subtle'>{exitSpotDateTime.time}</CaptionText>
                        </div>
                    </div>
                )}
            </div>
        </CardWrapper>
    );
};

export default EntryExitDetails;
