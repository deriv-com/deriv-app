import classNames                  from 'classnames';
import React                       from 'react';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import IconInfoOutline             from '../icon-info-outline.jsx';
import IconQuestion                from '../icon-question.jsx';
import IconRedDot                  from '../icon-red-dot.jsx';
import IconInfoBlue                from '../icon-info-blue.jsx';

class PopoverWrapper extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = { is_open: false };
    }

    componentDidMount () {
        this.setState({ is_open: this.props.has_error });
    }

    toggleOpen = () => this.setState({ is_open: Boolean(this.props.message) });

    toggleClose = () => this.setState({ is_open: false });

    render () {
        const {
            alignment,
            children,
            className,
            classNameBubble,
            classNameTarget,
            classNameTargetIcon,
            counter,
            disable_target_icon,
            disable_message_icon,
            has_error,
            icon,
            id,
            margin = 0,
            message,
        } = this.props;

        const icon_class_name = classNames(classNameTargetIcon, icon);
        return (
            <Popover
                isOpen={this.state.is_open}
                position={alignment}
                transitionDuration={0.25}
                padding={margin + 8}
                containerStyle={{ zIndex: 999 }}
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
                            className={classNames(
                                classNameBubble,
                                'dc-popover__bubble',
                                { 'dc-popover__bubble--error': has_error },
                            )}
                        >
                            { !disable_message_icon && icon === 'info' &&
                                <i className='dc-popover__bubble__icon'>
                                    <IconInfoBlue />
                                </i>
                            }
                            <span className='dc-popover__bubble__text'>
                                { message }
                            </span>
                        </div>
                    </ArrowContainer>
                )}
            >
                <div
                    className={classNames('dc-popover', className)}
                    id={id}
                    onMouseEnter={this.toggleOpen}
                    onMouseLeave={this.toggleClose}
                >
                    <div className={classNames(classNameTarget, 'dc-popover__target')}>
                        {!disable_target_icon &&
                        <i className={message ? 'dc-popover__target__icon' : 'dc-popover__target__icon--disabled'}>
                            {(icon === 'info')     && <IconInfoOutline className={icon_class_name} />}
                            {(icon === 'question') && <IconQuestion className={icon_class_name} />}
                            {(icon === 'dot')      && <IconRedDot className={icon_class_name} />}
                            {(icon === 'counter')  && <span className={icon_class_name}>{ counter }</span>}
                        </i>
                        }

                        {children}
                    </div>
                </div>
            </Popover>
        );
    }
}

PopoverWrapper.defaultProps = {
    portal_container: 'deriv_app',
};

export default PopoverWrapper;
