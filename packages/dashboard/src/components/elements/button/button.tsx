import * as React from 'react';
import classNames from 'classnames';
import { Button as CButton } from '@deriv/components';

const Button: React.FC<TButtonProps> = ({ className, children, ...props }) => {
    return (
        <CButton className={classNames('dw-btn', className)} {...props}>
            {children}
        </CButton>
    );
};

type TButtonProps = {
    className?: string;
    large?: boolean;
    primary?: boolean;
    tertiary?: boolean;
    children: React.ComponentType | React.ElementType | React.ReactElement;
};

export default Button;
