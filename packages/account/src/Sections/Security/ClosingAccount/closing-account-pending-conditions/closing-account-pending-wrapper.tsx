import { PropsWithChildren, ReactNode } from 'react';
import { Text } from '@deriv/components';

type TClosingAccountPendingWrapperProps = {
    title: JSX.Element;
    description?: ReactNode;
};

const ClosingAccountPendingWrapper = ({
    children,
    title,
    description,
}: PropsWithChildren<TClosingAccountPendingWrapperProps>) => (
    <div className='closing-account-error'>
        <Text as='p' line_height='s' size='xs' weight='bold' color='prominent' className='closing-account-error__title'>
            {title}
        </Text>
        {description && (
            <Text as='p' size='xxs' className='closing-account-error__description'>
                {description}
            </Text>
        )}
        <div className='closing-account-error__wrapper'>{children}</div>
    </div>
);

export default ClosingAccountPendingWrapper;
