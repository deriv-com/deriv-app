import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';

type TApiTokenTableRowCell = {
    children: React.ReactNode;
    className: string;
    should_bypass_text: boolean;
};

const ApiTokenTableRowCell = ({ className, children, should_bypass_text }: Partial<TApiTokenTableRowCell>) => {
    if (should_bypass_text) {
        return <td className={classNames('da-api-token__table-cell', className)}>{children}</td>;
    }

    return (
        <td className={classNames('da-api-token__table-cell', className)}>
            <Text color='prominent ' size='xs' line_height='m'>
                {children}
            </Text>
        </td>
    );
};

export default ApiTokenTableRowCell;
