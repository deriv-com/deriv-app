import { Text, CaptionText } from '@deriv-com/quill-ui';
import CardWrapper from '../CardWrapper';
import React from 'react';

const EntryExitDetails = () => {
    return (
        <CardWrapper title='Entry & exit details' className='entry-exit-details'>
            <div className='entry-exit-details__table'>
                <div className='entry-exit-details__table-row'>
                    <div className='entry-exit-details__table-cell'>
                        <Text size='sm' color='rgba(0, 0, 0, 0.48)'>
                            Start time
                        </Text>
                    </div>
                    <div className='entry-exit-details__table-cell'>
                        <Text size='sm'>01 Jan 2024</Text>
                        <CaptionText color='rgba(0, 0, 0, 0.48)'>12:00:00 GMT</CaptionText>
                    </div>
                </div>
                <div className='entry-exit-details__table-row'>
                    <div className='entry-exit-details__table-cell'>
                        <Text size='sm' color='rgba(0, 0, 0, 0.48)'>
                            Entry spot
                        </Text>
                    </div>
                    <div className='entry-exit-details__table-cell'>
                        <Text size='sm'>12134234.12345</Text>
                        <Text size='sm' color='rgba(0, 0, 0, 0.48)'>
                            01 Jan 2024
                        </Text>
                        <CaptionText color='rgba(0, 0, 0, 0.48)'>12:00:00 GMT</CaptionText>
                    </div>
                </div>
                <div className='entry-exit-details__table-row'>
                    <div className='entry-exit-details__table-cell'>
                        <Text size='sm' color='rgba(0, 0, 0, 0.48)'>
                            Exit time
                        </Text>
                    </div>
                    <div className='entry-exit-details__table-cell'>
                        <Text size='sm'>01 Jan 2024</Text>
                        <CaptionText color='rgba(0, 0, 0, 0.48)'>12:00:00 GMT</CaptionText>
                    </div>
                </div>
                <div className='entry-exit-details__table-row'>
                    <div className='entry-exit-details__table-cell'>
                        <Text size='sm' color='rgba(0, 0, 0, 0.48)'>
                            Exit spot
                        </Text>
                    </div>
                    <div className='entry-exit-details__table-cell'>
                        <Text size='sm'>12134234.12345</Text>
                        <Text size='sm' color='rgba(0, 0, 0, 0.48)'>
                            01 Jan 2024
                        </Text>
                        <CaptionText color='rgba(0, 0, 0, 0.48)'>12:00:00 GMT</CaptionText>
                    </div>
                </div>
            </div>
        </CardWrapper>
    );
};

export default EntryExitDetails;
