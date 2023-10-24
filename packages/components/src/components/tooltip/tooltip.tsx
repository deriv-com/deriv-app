import classNames from 'classnames';
import React from 'react';
import Icon from '../icon';
import { useHover } from '../../hooks/use-hover';

type TTooltip = {
    alignment: string;
    className?: string;
    classNameIcon?: string;
    has_error?: boolean;
    icon?: string;
    message?: string | null;
};

const Tooltip = ({
    alignment,
    children,
    className,
    classNameIcon,
    has_error,
    icon, // only question, info and dot accepted
    message,
}: React.PropsWithChildren<TTooltip>) => {
    const [hover_ref, show_tooltip_balloon_icon_on_hover] = useHover<SVGSVGElement>();

    const icon_class = classNames(classNameIcon, icon);

    return (
        <span
            className={classNames(className, 'dc-tooltip', { 'dc-tooltip--error': has_error })}
            data-tooltip={message || undefined}
            data-tooltip-pos={alignment}
        >
            {icon === 'info' && (
                <React.Fragment>
                    <Icon icon='IcInfoOutline' className={icon_class} ref={hover_ref} />
                    <Icon
                        icon='IcInfoBlue'
                        className={classNames(`${classNameIcon}-balloon-icon`, 'dc-tooltip__balloon-icon', {
                            'dc-tooltip__balloon-icon--show': show_tooltip_balloon_icon_on_hover,
                        })}
                    />
                </React.Fragment>
            )}
            {icon === 'question' && <Icon icon='IcUnknown' className={icon_class} />}
            {icon === 'dot' && <Icon icon='IcCircle' className={icon_class} size={4} />}
            {children}
        </span>
    );
};

export default Tooltip;
