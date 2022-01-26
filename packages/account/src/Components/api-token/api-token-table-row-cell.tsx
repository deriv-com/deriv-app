import classNames from 'classnames';
import * as React from 'react';
import { Text } from '@deriv/components';

type ApiTokenTableRowCellProps = {
    children: React.ReactNode;
    should_bypass_text: boolean;
};

const ApiTokenTableRowCell = ({ className, children, should_bypass_text }: ApiTokenTableRowCellProps) => {
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
