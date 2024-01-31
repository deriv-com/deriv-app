import React, { HTMLAttributes, ReactNode } from 'react';

type TFlyoutToggleProps = HTMLAttributes<HTMLDivElement> & {
    renderIcon?: () => ReactNode;
};

const FlyoutToggle = ({ renderIcon, ...props }: TFlyoutToggleProps) => {
    return <div {...props}>{renderIcon?.()}</div>;
};

export default FlyoutToggle;
