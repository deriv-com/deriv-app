import { Text, CaptionText } from '@deriv-com/quill-ui';
import CardWrapper from '../CardWrapper';
import React from 'react';
import clsx from 'classnames';

const TakeProfitHistory = () => {
    return (
        <CardWrapper title='TP history' className='take-profit-history'>
            <div className='take-profit-history__table'>
                <div className='take-profit-history__table-row'>
                    <div className={clsx('take-profit-history__table-cell', 'take-profit-history__table-cell--left')}>
                        <CaptionText size='sm'>01 Jan 2024</CaptionText>
                        <CaptionText color='rgba(0, 0, 0, 0.48)'>12:00:00 GMT</CaptionText>
                    </div>
                    <div className='take-profit-history__table-cell'>
                        <Text size='sm'>Take profit</Text>
                        <Text color='rgba(0, 0, 0, 0.48)' size='sm'>
                            5.00 USD
                        </Text>
                    </div>
                </div>
            </div>
        </CardWrapper>
    );
};

export default TakeProfitHistory;
