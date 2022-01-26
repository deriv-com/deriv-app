import React from 'react';

type MediaIconProps = {
    disabled: () => void;
    enabled: () => void;
    id: string;
    is_enabled: boolean;
};

const MediaIcon = ({ id, is_enabled, enabled, disabled }: MediaIconProps) => {
    const Icon = is_enabled ? enabled : disabled;
    return <Icon id={id} className='media__icon' />;
};

export { MediaIcon };
