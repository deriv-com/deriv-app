import React from 'react';
import classNames from 'classnames';
import './as-disabled-wrapper.scss';

type TProps = {
    is_active: boolean;
    onAction: () => void;
    className?: string;
};

const AsDisabledWrapper = ({ children, is_active, onAction, className = '' }: React.PropsWithChildren<TProps>) => {
    const StyledChildren = () => {
        return React.Children.map(children, child =>
            React.cloneElement(child as React.ReactElement, {
                className: `${child.props.className} as-disabled-wrapper__children`,
            })
        ) as unknown as React.ReactHTMLElement<never>;
    };

    return is_active ? (
        <div
            className={classNames('as-disabled-wrapper', {
                [className]: className,
            })}
            onClickCapture={e => {
                onAction?.();
                e.stopPropagation();
            }}
        >
            <StyledChildren />
        </div>
    ) : (
        <div
            className={classNames({
                [className]: className,
            })}
        >
            {children}
        </div>
    );
};
export default AsDisabledWrapper;
