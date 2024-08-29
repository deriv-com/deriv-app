import { ReactNode, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv/components';

type TAccountLimitsTableHeader = {
    align: 'left' | 'right';
    renderExtraInfo: () => ReactNode;
};

const AccountLimitsTableHeader = ({
    align,
    children,
    renderExtraInfo,
}: PropsWithChildren<Partial<TAccountLimitsTableHeader>>) => {
    return (
        <th
            className={clsx('da-account-limits__table-header', {
                'da-account-limits__table-header--left': align !== 'right',
                'da-account-limits__table-header--right': align === 'right',
            })}
            data-testid='account_limit_table_header'
        >
            {children && (
                <Text
                    align={align}
                    as='p'
                    color='prominent'
                    size='xs'
                    line_height='m'
                    weight='bold'
                    data-testid='account_limit_table_header_text'
                >
                    {children}
                </Text>
            )}
            {renderExtraInfo?.()}
        </th>
    );
};

export default AccountLimitsTableHeader;
