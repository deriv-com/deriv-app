import * as React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';

type AccountLimitsTableHeaderProps = {
    align: unknown;
    children: React.ReactNode;
};

const AccountLimitsTableHeader = ({ align, children, renderExtraInfo }: AccountLimitsTableHeaderProps) => {
    return (
        <th
            className={classNames('da-account-limits__table-header', {
                'da-account-limits__table-header--left': align !== 'right',
                'da-account-limits__table-header--right': align === 'right',
            })}
        >
            {children && (
                <Text align={align} as='p' color='prominent' size='xxs' line_height='m' weight='bold'>
                    {children}
                </Text>
            )}
            {renderExtraInfo && renderExtraInfo()}
        </th>
    );
};

export default AccountLimitsTableHeader;
