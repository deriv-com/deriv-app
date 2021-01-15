import * as React from 'react';
import classNames from 'classnames';
import { Button as CButton } from '@deriv/components';
import { TReactChildren } from 'Types'

const Button: React.FC<TButton> = ({ className, children, onClick, ...props }) => {
    return (
        <CButton className={classNames('dw-btn', className)} onClick={onClick} {...props}>
            {children}
        </CButton>
    );
};

type TButton = {
    className?: string;
    large?: boolean;
    primary?: boolean;
    tertiary?: boolean;
    children: TReactChildren;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default Button;
