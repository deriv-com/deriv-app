import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import TinyPopover, { ArrowContainer } from 'react-tiny-popover';
import Icon from '../icon';

class Popover extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_open: false,
            is_bubble_open: false,
        };
    }

    componentDidMount() {
        this.setState({ is_open: this.props.has_error });
    }

    toggleOpen = () => {
        this.setState({ is_open: Boolean(this.props.message) });
    };

    toggleClose = () => {
        if (this.props.is_bubble_hover_enabled) {
            this.toggleIsOpenOnHoverPopoverBubble();
        } else {
            this.setState({ is_open: false });
        }
    };

    onMouseEnter = () => {
        this.setState({ is_bubble_open: true });
    };

    onMouseLeave = () => {
        this.setState({ is_bubble_open: false, is_open: false });
    };

    toggleIsOpenOnHoverPopoverBubble = () => {
        setTimeout(() => {
            // add delay to check if mouse is hovered on popover bubble
            this.setState({ is_open: this.props.is_bubble_hover_enabled ? this.state.is_bubble_open : false });
        }, 50);
    };

    render() {
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
        } = this.props;

        const has_external_open_state = is_open !== undefined;
        const icon_class_name = classNames(classNameTargetIcon, icon);
        return (
            <TinyPopover
                isOpen={has_external_open_state ? is_open : this.state.is_open}
                position={alignment}
                transitionDuration={0.25}
                padding={margin + 8}
                containerStyle={{ zIndex: zIndex || 1 }}
                content={({ position, targetRect, popoverRect }) => (
                    <ArrowContainer
                        position={position}
                        targetRect={targetRect}
                        popoverRect={popoverRect}
                        arrowColor={has_error ? 'var(--status-danger)' : 'var(--general-active)'}
                        arrowSize={5}
                    >
                        <div
                            id={id}
                            className={classNames(classNameBubble, 'dc-popover__bubble', {
                                'dc-popover__bubble--error': has_error,
                            })}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
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
                )}
            >
                <div
                    className={classNames('dc-popover', className)}
                    id={id}
                    onMouseEnter={has_external_open_state ? undefined : this.toggleOpen}
                    onMouseLeave={has_external_open_state ? undefined : this.toggleClose}
                >
                    <div className={classNames(classNameTarget, 'dc-popover__target')}>
                        {!disable_target_icon && (
                            <i className={message ? 'dc-popover__target__icon' : 'dc-popover__target__icon--disabled'}>
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
        );
    }
}

Popover.defaultProps = {
    portal_container: 'deriv_app',
    margin: 0,
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
    margin: PropTypes.number,
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.object, PropTypes.string]),
    portal_container: PropTypes.string,
    zIndex: PropTypes.number,
};

export default Popover;
