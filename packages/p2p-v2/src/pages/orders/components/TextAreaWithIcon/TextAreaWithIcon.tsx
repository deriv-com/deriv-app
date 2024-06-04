import React, { ComponentProps, forwardRef, ReactNode } from 'react';
import { TextArea } from '@deriv-com/ui';
import './TextAreaWithIcon.scss';

type TTextAreaWithIconProps = ComponentProps<typeof TextArea> & {
    icon: ReactNode;
};

const TextAreaWithIcon = forwardRef<HTMLTextAreaElement, TTextAreaWithIconProps>(({ icon, ...rest }, ref) => {
    return (
        <div className='p2p-v2-text-area-with-icon'>
            <TextArea {...rest} className='p2p-v2-text-area-with-icon__textarea' ref={ref} textSize='sm' />
            {<div className='p2p-v2-text-area-with-icon__icon'>{icon}</div>}
        </div>
    );
});

TextAreaWithIcon.displayName = 'TextAreaWithIcon';
export default TextAreaWithIcon;
