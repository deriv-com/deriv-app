import React, { HTMLAttributes, ReactNode } from 'react';

type TFlyoutToggleProps = HTMLAttributes<HTMLDivElement> & {
    renderIcon?: () => ReactNode;
};

const FlyoutToggle = ({ renderIcon, ...props }: TFlyoutToggleProps) => {
    return (
        <div {...props} data-testid='dt_p2p_v2_flyout_toggle'>
            {renderIcon?.()}
        </div>
    );
};

export default FlyoutToggle;
