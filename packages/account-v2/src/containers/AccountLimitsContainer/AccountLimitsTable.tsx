import React from 'react';
import { StandaloneCircleInfoRegularIcon } from '@deriv/quill-icons';
import { Table, Text } from '@deriv-com/ui';
import { TAccountLimitValues } from '../../types';
import { CATEGORY } from '../../utils/accountLimitsUtils';

const RenderRow = ({ category, hintInfo, isLessProminent, title, value }: TAccountLimitValues) => {
    return (
        <div className='grid grid-flow-col justify-between'>
            <div>
                {title && (
                    <Text
                        className={category === CATEGORY.submarket ? 'px-16' : ''}
                        color={isLessProminent ? 'less-prominent' : 'general'}
                        size={category === CATEGORY.footer ? 'xs' : 'sm'}
                        weight={category === CATEGORY.header ? 'bold' : ''}
                    >
                        {title}
                    </Text>
                )}
                {hintInfo && (
                    <span className='px-8'>
                        <StandaloneCircleInfoRegularIcon className='fill-solid-grey-1' iconSize='sm' />
                    </span>
                )}
            </div>
            {value && (
                <Text size='sm' weight={category === CATEGORY.header ? 'bold' : ''}>
                    {value}
                </Text>
            )}
        </div>
    );
};

export const AccountLimitsTable = ({ accountLimitValues }: { accountLimitValues: TAccountLimitValues[] }) => (
    <Table
        data={accountLimitValues}
        isFetching={false}
        loadMoreFunction={() => {
            //[TODO]: Add load more function
        }}
        rowRender={RenderRow}
    />
);
