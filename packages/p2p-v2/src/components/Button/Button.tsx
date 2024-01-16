import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import './Button.scss';

type TButtonProps = {
    disabled?: boolean;
    isFullWidth?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
const Button = ({ children, disabled, isFullWidth = false, onClick }: PropsWithChildren<TButtonProps>) => {
    // TODO: Once Button component is transitioned from @deriv/ui, check button should have Success loading animation when submitted
    return (
        <button
            className={clsx('p2p-v2-button', {
                'p2p-v2-button--full-width': isFullWidth,
            })}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
