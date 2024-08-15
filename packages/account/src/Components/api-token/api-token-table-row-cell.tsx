import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv/components';

type TApiTokenTableRowCell = {
    className?: string;
    should_bypass_text: boolean;
};

const ApiTokenTableRowCell = ({
    className,
    children,
    should_bypass_text,
}: PropsWithChildren<Partial<TApiTokenTableRowCell>>) => {
    if (should_bypass_text) {
        return <td className={clsx('da-api-token__table-cell', className)}>{children}</td>;
    }

    return (
        <td className={clsx('da-api-token__table-cell', className)}>
            <Text color='prominent ' size='xs' line_height='m'>
                {children}
            </Text>
        </td>
    );
};

export default ApiTokenTableRowCell;
