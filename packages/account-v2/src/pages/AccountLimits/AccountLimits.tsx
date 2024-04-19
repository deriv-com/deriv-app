import React from 'react';
import { useAccountLimits, useActiveAccount } from '@deriv/api-v2';
import { StandaloneCircleInfoRegularIcon } from '@deriv/quill-icons';
import { Loader, Table, Text } from '@deriv-com/ui';
import { getAccountLimitValues } from '../../utils/accountLimitsUtils';

const RenderRow = ({ row }: any) => (
    <div className='grid grid-flow-col justify-between'>
        <div>
            {row.title && (
                <Text
                    className={row.isSubCategory ? 'px-16' : ''}
                    color={row.isLessProminent ? 'less-prominent' : 'general'}
                    size={row.isFooter ? 'xs' : 'sm'}
                    weight={row.isHeader ? 'bold' : ''}
                >
                    {row.title}
                </Text>
            )}
            {row.hintInfo && (
                <span className='px-8'>
                    <StandaloneCircleInfoRegularIcon fill='#b5abab' iconSize='md' />
                </span>
            )}
        </div>
        {row.value && (
            <Text size='sm' weight={row.isHeader ? 'bold' : ''}>
                {row.value}
            </Text>
        )}
    </div>
);

export const AccountLimits = () => {
    const { data: accountLimits, isLoading } = useAccountLimits();
    const { data: activeAccount } = useActiveAccount();
    const currency = activeAccount?.currency;
    if (isLoading) return <Loader isFullScreen={false} />;

    return accountLimits ? (
        <div>
            {getAccountLimitValues(accountLimits, currency).map(item => (
                <React.Fragment key={item.id}>
                    <Table
                        data={item.data}
                        isFetching={false}
                        //eslint-disable-next-line
                        loadMoreFunction={() => {}}
                        rowRender={row => <RenderRow row={row} />}
                    />
                </React.Fragment>
            ))}
        </div>
    ) : null;
};
