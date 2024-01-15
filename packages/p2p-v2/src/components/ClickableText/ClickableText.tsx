import React, { ComponentProps } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './clickable-text.scss';

type TClickableTextProps = ComponentProps<typeof Text> & {
    onClick?: () => void;
};

const ClickableText = ({ onClick, ...props }: TClickableTextProps) => {
    return (
        <div className='p2p-v2-clickable-text__wrapper' onClick={onClick}>
            <Text {...props} />
        </div>
    );
};

export default ClickableText;
