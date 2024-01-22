import React, { ComponentProps, PropsWithChildren } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';
import './ClickableText.scss';

type TClickableTextProps = ComponentProps<typeof Text> & {
    onClick?: () => void;
};

const ClickableText = ({ children, onClick, ...props }: PropsWithChildren<TClickableTextProps>) => {
    return (
        <span onClick={onClick}>
            <Text className='p2p-v2-clickable-text__wrapper' size='xs' {...props}>
                {children}
            </Text>
        </span>
    );
};

export default ClickableText;
