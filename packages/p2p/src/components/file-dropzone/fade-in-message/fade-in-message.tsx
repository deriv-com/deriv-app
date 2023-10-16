import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Text } from '@deriv/components';

type TFadeInMessage = {
    is_visible: boolean;
    color?: string;
    key?: string;
    timeout: number;
    no_text?: boolean;
};

const FadeInMessage = ({
    children,
    color,
    is_visible,
    key,
    no_text,
    timeout,
}: React.PropsWithChildren<TFadeInMessage>) => (
    <CSSTransition
        appear
        classNames={{
            appear: 'fade-in-message--enter',
            enter: 'fade-in-message--enter',
            enterActive: 'fade-in-message--enter-active',
            enterDone: 'fade-in-message--enter-done',
            exit: 'fade-in-message--exit',
            exitActive: 'fade-in-message--exit-active',
        }}
        in={is_visible}
        key={key}
        timeout={timeout}
        unmountOnExit
    >
        {no_text ? (
            <div className='fade-in-message'>{children}</div>
        ) : (
            <Text align='center' className='fade-in-message' color={color || 'general'} size='xxs'>
                {children}
            </Text>
        )}
    </CSSTransition>
);

export default FadeInMessage;
