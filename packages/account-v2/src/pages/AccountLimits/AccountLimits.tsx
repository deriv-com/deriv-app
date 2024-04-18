import React from 'react';
import { useAccountLimits, useActiveAccount } from '@deriv/api-v2';
import { StandaloneCircleInfoRegularIcon } from '@deriv/quill-icons';
import { Loader, Table, Text } from '@deriv-com/ui';
import { getMaximumDailyLimiitsTableData, getTradingLimitsTableData } from '../../utils/accountLimitsUtils';

export const AccountLimits = () => {
    const { data: accountLimits, isLoading } = useAccountLimits();
    const { data: activeAccount } = useActiveAccount();
    const currency = activeAccount?.currency || 0;
    if (isLoading) return <Loader isFullScreen={false} />;

    const getValues = () => [
        {
            data: getTradingLimitsTableData(accountLimits, currency),
            header: [
                {
                    header: 'Trading limits',
                },
                {
                    header: 'Limit',
                },
            ],
            id: 'trading_limits',
        },
        {
            data: getMaximumDailyLimiitsTableData(),
            header: [
                {
                    header: 'Maximum daily turnover',
                },
                {
                    header: 'Limit',
                },
            ],
            id: 'daily_turnover',
        },
        {
            data: getMaximumDailyLimiitsTableData(),
            header: [
                {
                    header: 'Withdrawal limits',
                },
                {
                    header: '',
                    id: 'empty_header',
                },
            ],
            id: 'withdrawal_limits',
        },
    ];
    return (
        <div>
            {getValues().map(item => (
                <React.Fragment key={item.id}>
                    <Table
                        columns={item.header}
                        data={item.data}
                        isFetching={false}
                        //eslint-disable-next-line
                        loadMoreFunction={() => {}}
                        renderHeader={header => <span>{header}</span>}
                        rowRender={row => (
                            <div className='grid grid-flow-col'>
                                {row.title && <Text size='xs'>{row.title}</Text>}
                                {row.hintInfo && <StandaloneCircleInfoRegularIcon fill='#b5abab' iconSize='md' />}
                                {row.value && <Text size='xs'>{row.value}</Text>}
                            </div>
                        )}
                    />
                </React.Fragment>
            ))}
        </div>
    );
};
