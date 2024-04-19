import React from 'react';
import { useAccountLimits, useActiveAccount } from '@deriv/api-v2';
import { StandaloneCircleInfoRegularIcon } from '@deriv/quill-icons';
import { Loader, Table, Text } from '@deriv-com/ui';
import { CATEGORY, getAccountLimitValues, TRowData } from '../../utils/accountLimitsUtils';

const RenderRow = ({ row }: { row: TRowData }) => {
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

export const AccountLimits = () => {
    const { data: accountLimits, isLoading } = useAccountLimits();
    const { data: activeAccount } = useActiveAccount();
    const currency = activeAccount?.currency;

    if (isLoading) return <Loader isFullScreen={false} />;

    return accountLimits ? (
        <div>
            <Table
                data={getAccountLimitValues(accountLimits, currency)}
                isFetching={false}
                //eslint-disable-next-line
                loadMoreFunction={() => {}}
                rowRender={rowData => <RenderRow row={rowData} />}
            />
        </div>
    ) : null;
};
