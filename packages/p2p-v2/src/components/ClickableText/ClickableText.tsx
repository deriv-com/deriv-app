import React, { ComponentProps } from 'react';
import { Text } from '@deriv-com/ui/dist/components/Text';

type TClickableTextProps = ComponentProps<typeof Text> & {
    onClick?: () => void;
};

const ClickableText = ({ onClick, ...props }: TClickableTextProps) => {
    return (
        <div onClick={onClick}>
            <Text {...props} />
        </div>
    );
};

export default ClickableText;
