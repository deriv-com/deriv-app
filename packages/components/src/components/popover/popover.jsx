import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import TinyPopover, { ArrowContainer } from 'react-tiny-popover';
import Icon from '../icon';

const Popover = ({ ...props }) => {
    const ref = React.useRef();

    const [is_popover_open, setIsPopoverOpen] = React.useState(false);
    const [is_bubble_open, setIsBubbleOpen] = React.useState(false);
    const [popover_ref, setPopoverRef] = React.useState(undefined);
    const bubble_ref = React.useRef(is_bubble_open);

    const has_external_open_state = props.is_open !== undefined;

    React.useEffect(() => {
        bubble_ref.current = is_bubble_open;
    }, [is_bubble_open]);

    React.useEffect(() => {
        if (ref.current) {
            setPopoverRef(ref.current);
        }
        setIsPopoverOpen(!!props.has_error);
    }, [ref.current, props.has_error]);

    const onClick = React.useCallback(() => {
        setIsBubbleOpen(!is_bubble_open);
    }, [is_bubble_open]);

    const toggleOpen = React.useCallback(() => {
        if (props.onOpen) props.onOpen();
        if (has_external_open_state) return;
        setIsPopoverOpen(Boolean(props.message));
    }, [props.message, props.onOpen]);

    const toggleClose = React.useCallback(() => {
        if (props.onClose) props.onClose();
        if (has_external_open_state) return;
        if (props.is_bubble_hover_enabled) {
            setTimeout(() => {
                // add delay to check if mouse is hovered on popover bubble
                // because of JS closures, there is no guaranty that the state used inside a setTimeout is updated. so we use bubble_ref.
                setIsPopoverOpen(bubble_ref.current);
            }, 50);
        } else {
            setIsPopoverOpen(false);
        }
    }, [props.is_bubble_hover_enabled, props.onClose]);

    const onMouseEnter = React.useCallback(() => {
        setIsBubbleOpen(true);
        if (props.onBubbleOpen) props.onBubbleOpen();
    }, [props.onBubbleOpen]);

    const onMouseLeave = React.useCallback(() => {
        setIsPopoverOpen(false);
        setIsBubbleOpen(false);
        if (props.onBubbleClose) props.onBubbleClose();
    }, [props.onBubbleClose]);

    const {
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
        margin,
        message,
        zIndex,
        relative_render,
        should_disable_pointer_events,
    } = props;

    const icon_class_name = classNames(classNameTargetIcon, icon);

    return (
        <div className={classNames({ 'dc-popover__wrapper': relative_render })}>
            {relative_render && (
                <div className='dc-popover__container' style={{ zIndex: zIndex || 1 }}>
                    <div ref={ref} className='dc-popover__container-relative' />
                </div>
            )}
            {(popover_ref || !relative_render) && (
                <TinyPopover
                    isOpen={is_open ?? is_popover_open}
                    position={alignment}
                    transitionDuration={0.25}
                    padding={margin + 8}
                    contentDestination={relative_render ? popover_ref : document.body}
                    containerClassName={classNames({
                        'react-tiny-popover-container--disabled-pointer-event': should_disable_pointer_events,
                    })}
                    {...(relative_render
                        ? {
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
                        : { containerStyle: { zIndex: zIndex || 1 } })}
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
                                    onClick={onClick}
                                    className={classNames(classNameBubble, 'dc-popover__bubble', {
                                        'dc-popover__bubble--error': has_error,
                                    })}
                                >
                                    {!disable_message_icon && icon === 'info' && (
                                        <i className='dc-popover__bubble__icon'>
                                            <Icon icon='IcInfoBlue' />
                                        </i>
                                    )}
                                    <span
                                        className={classNames('dc-popover__bubble__text', {
                                            'dc-popover__bubble__text--error': has_error,
                                        })}
                                    >
                                        {message}
                                    </span>
                                </div>
                            </ArrowContainer>
                        );
                    }}
                >
                    <div
                        className={classNames('dc-popover', className)}
                        id={id}
                        onMouseEnter={toggleOpen}
                        onMouseLeave={toggleClose}
                    >
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

Popover.defaultProps = {
    margin: 0,
    relative_render: false,
    should_disable_pointer_events: false,
};

Popover.propTypes = {
    alignment: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    classNameBubble: PropTypes.string,
    classNameTarget: PropTypes.string,
    classNameTargetIcon: PropTypes.string,
    counter: PropTypes.number,
    disable_message_icon: PropTypes.bool,
    disable_target_icon: PropTypes.bool,
    has_error: PropTypes.bool,
    icon: PropTypes.oneOf(['info', 'question', 'dot', 'counter']),
    id: PropTypes.string,
    is_bubble_hover_enabled: PropTypes.bool,
    is_open: PropTypes.bool,
    relative_render: PropTypes.bool,
    margin: PropTypes.number,
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.object, PropTypes.string]),
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onBubbleOpen: PropTypes.func,
    onBubbleClose: PropTypes.func,
    zIndex: PropTypes.number,
    should_disable_pointer_events: PropTypes.bool,
};

export default Popover;
