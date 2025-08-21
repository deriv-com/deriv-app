import React from 'react';
import { PopoverPosition } from 'react-tiny-popover';

export type TPopoverProps = {
    alignment: PopoverPosition;
    className?: string;
    classNameBubble?: string;
    classNameTarget?: string;
    classNameTargetIcon?: string;
    counter?: number;
    disable_message_icon?: boolean;
    disable_target_icon?: boolean;
    has_error?: boolean;
    icon?: 'info' | 'question' | 'dot' | 'counter';
    id?: string;
    is_bubble_hover_enabled?: boolean;
    is_open?: boolean;
    relative_render?: boolean;
    margin?: number;
    message: React.ReactNode;
    onBubbleOpen?: () => void;
    onBubbleClose?: () => void;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    should_disable_pointer_events?: boolean;
    should_show_cursor?: boolean;
    zIndex?: string;
    data_testid?: string;
    arrow_styles?: React.CSSProperties;
    arrow_color?: string; // Custom arrow color
    background_color?: string; // Custom background color
    is_inline_block?: boolean;
};
