import React, { HTMLAttributes, ReactNode } from 'react';

type TFlyOutToggleProps = HTMLAttributes<HTMLDivElement> & {
    renderIcon?: () => ReactNode;
};

const FlyOutToggle = ({ renderIcon, ...props }: TFlyOutToggleProps) => {
    return <div {...props}>{renderIcon?.()}</div>;
};

export default FlyOutToggle;
