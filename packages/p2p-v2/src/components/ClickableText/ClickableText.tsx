import React, { ComponentProps, PropsWithChildren } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './ClickableText.scss';

type TClickableTextProps = ComponentProps<typeof Text> & {
    onClick?: () => void;
};

const ClickableText = ({ children, onClick, ...props }: PropsWithChildren<TClickableTextProps>) => {
    return (
        <div className='p2p-v2-clickable-text__wrapper' onClick={onClick}>
            <Text {...props}>{children}</Text>
        </div>
    );
};

export default ClickableText;
