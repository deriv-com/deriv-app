import classNames from 'classnames';
import React, { RefObject } from 'react';
import TinyPopover, { ArrowContainer } from 'react-tiny-popover';
import Icon from '../icon';
import Text from '../text';
import { useHover, useHoverCallback } from '../../hooks/use-hover';
import { TPopoverProps } from '../types';

const Popover = ({
    alignment,
    children,
    className,
    classNameBubble,
    classNameTarget,
    classNameTargetIcon,
    counter,
    disable_message_icon,
    disable_target_icon,
    has_error,
    icon,
    id,
    is_open,
    is_bubble_hover_enabled,
    margin = 0,
    message,
    onBubbleClose,
    onBubbleOpen,
    onClick = () => undefined,
    relative_render = false,
    should_disable_pointer_events = false,
    should_show_cursor,
    window_border,
    zIndex = '1',
    data_testid,
}: React.PropsWithChildren<Partial<TPopoverProps>>) => {
    const ref = React.useRef<HTMLDivElement | undefined>();
    const [popover_ref, setPopoverRef] = React.useState<HTMLDivElement | undefined>(undefined);

    const [hover_ref, is_hovered] = useHover(null, true);
    const [bubble_hover_ref, is_bubble_hovered] = useHoverCallback();

    React.useEffect(() => {
        if (ref.current) {
            setPopoverRef(ref.current);
        }
    }, [has_error]);

    const onMouseEnter = () => {
        if (onBubbleOpen) onBubbleOpen();
    };

    const onMouseLeave = () => {
        if (onBubbleClose) onBubbleClose();
    };

    const icon_class_name = classNames(classNameTargetIcon, icon);

    return (
        <div
            ref={hover_ref as RefObject<HTMLDivElement>}
            className={classNames({ 'dc-popover__wrapper': relative_render })}
            onClick={onClick}
            data-testid='dt_popover_wrapper'
        >
            {relative_render && (
                <div className='dc-popover__container' style={{ zIndex }}>
                    <div ref={ref as RefObject<HTMLDivElement>} className='dc-popover__container-relative' />
                </div>
            )}
            {(popover_ref || !relative_render) && (
                <TinyPopover
                    isOpen={
                        (is_bubble_hover_enabled
                            ? is_open ?? ((is_hovered && message) || (is_bubble_hover_enabled && is_bubble_hovered))
                            : is_open ?? (is_hovered && message)) as boolean
                    }
                    position={alignment}
                    transitionDuration={0.25}
                    padding={margin + 8}
                    containerClassName={classNames({
                        'react-tiny-popover-container--disabled-pointer-event': should_disable_pointer_events,
                        'react-tiny-popover-cursor-option': should_show_cursor,
                    })}
                    windowBorderPadding={window_border}
                    {...(relative_render
                        ? {
                              contentDestination: popover_ref,
                              contentLocation: ({ targetRect, popoverRect, nudgedLeft }) => {
                                  const screen_width = document.body.clientWidth;
                                  const total_width = targetRect.right + (popoverRect.width - targetRect.width / 2);
                                  let top_offset = 0;
                                  let left_offset = 0;

                                  switch (alignment) {
                                      case 'left': {
                                          left_offset =
                                              Math.abs(
                                                  (popoverRect.height > popoverRect.width
                                                      ? nudgedLeft
                                                      : popoverRect.width) + margin
                                              ) * -1;
                                          top_offset =
                                              targetRect.height > popoverRect.height
                                                  ? (targetRect.height - popoverRect.height) / 2
                                                  : ((popoverRect.height - targetRect.height) / 2) * -1;
                                          break;
                                      }
                                      case 'right': {
                                          left_offset = popoverRect.width + margin;
                                          top_offset =
                                              targetRect.height > popoverRect.height
                                                  ? (targetRect.height - popoverRect.height) / 2
                                                  : ((popoverRect.height - targetRect.height) / 2) * -1;
                                          break;
                                      }
                                      case 'top': {
                                          left_offset =
                                              total_width > screen_width
                                                  ? Math.abs(total_width - screen_width) * -1
                                                  : 0;
                                          top_offset = Math.abs(popoverRect.height + margin) * -1;
                                          break;
                                      }
                                      case 'bottom': {
                                          left_offset =
                                              total_width > screen_width
                                                  ? Math.abs(total_width - screen_width) * -1
                                                  : 0;
                                          top_offset = targetRect.height + margin;
                                          break;
                                      }
                                      default:
                                          break;
                                  }
                                  return {
                                      top: top_offset,
                                      left: left_offset,
                                  };
                              },
                          }
                        : { containerStyle: { zIndex } })}
                    content={({ position, targetRect, popoverRect }) => {
                        return (
                            <ArrowContainer
                                position={position}
                                targetRect={targetRect}
                                popoverRect={popoverRect}
                                arrowColor={has_error ? 'var(--status-danger)' : 'var(--general-active)'}
                                arrowSize={5}
                            >
                                <div
                                    id={id}
                                    onMouseEnter={onMouseEnter}
                                    onMouseLeave={onMouseLeave}
                                    className={classNames(classNameBubble, 'dc-popover__bubble', {
                                        'dc-popover__bubble--error': has_error,
                                    })}
                                    ref={bubble_hover_ref as (node: HTMLDivElement) => void}
                                >
                                    {!disable_message_icon && icon === 'info' && (
                                        <i className='dc-popover__bubble__icon'>
                                            <Icon icon='IcInfoBlue' />
                                        </i>
                                    )}
                                    {(has_error && (
                                        <Text size='xxs' color='colored-background'>
                                            {message}
                                        </Text>
                                    )) || (
                                        <Text line_height='m' size='xxs' className='dc-popover__bubble__text'>
                                            {message}
                                        </Text>
                                    )}
                                </div>
                            </ArrowContainer>
                        );
                    }}
                >
                    <div data-testid={data_testid} className={classNames('dc-popover', className)} id={id}>
                        <div className={classNames(classNameTarget, 'dc-popover__target')}>
                            {!disable_target_icon && (
                                <i
                                    className={
                                        message ? 'dc-popover__target__icon' : 'dc-popover__target__icon--disabled'
                                    }
                                >
                                    {icon === 'info' && <Icon icon='IcInfoOutline' className={icon_class_name} />}
                                    {icon === 'question' && <Icon icon='IcUnknown' className={icon_class_name} />}
                                    {icon === 'dot' && <Icon icon='IcCircle' className={icon_class_name} size={4} />}
                                    {icon === 'counter' && <span className={icon_class_name}>{counter}</span>}
                                </i>
                            )}

                            {children}
                        </div>
                    </div>
                </TinyPopover>
            )}
        </div>
    );
};

export default Popover;
