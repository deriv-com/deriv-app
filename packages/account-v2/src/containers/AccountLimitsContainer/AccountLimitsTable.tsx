import React from 'react';
import { StandaloneCircleInfoRegularIcon } from '@deriv/quill-icons';
import { Table, Text } from '@deriv-com/ui';
import { CATEGORY, TAccountLimitValues } from '../../utils/accountLimitsUtils';

const RenderRow = ({ row }: { row: TAccountLimitValues }) => {
    const { category, hintInfo, isLessProminent, title, value } = row;
    return (
        <div className='grid grid-flow-col justify-between'>
            <div>
                {title && (
                    <Text
                        className={category === CATEGORY.sub_row ? 'px-16' : ''}
                        color={isLessProminent ? 'less-prominent' : 'general'}
                        size={category === CATEGORY.footer ? 'xs' : 'sm'}
                        weight={category === CATEGORY.header ? 'bold' : ''}
                    >
                        {title}
                    </Text>
                )}
                {hintInfo && (
                    <span className='px-8'>
                        <StandaloneCircleInfoRegularIcon fill='#b5abab' iconSize='md' />
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
        //eslint-disable-next-line
        loadMoreFunction={() => {}}
        rowRender={rowData => <RenderRow row={rowData} />}
    />
);
