import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import ReactDOM             from 'react-dom';
import posed, { PoseGroup } from 'react-pose';
import { Icon }             from 'Assets/Common/icon.jsx';
import { IconInfoBlue }     from 'Assets/Common/icon-info-blue.jsx';
import { IconQuestion }     from 'Assets/Common/icon-question.jsx';
import { IconRedDot }       from 'Assets/Common/icon-red-dot.jsx';

const FadeIn = posed.div({
    enter: {
        opacity   : 1,
        transition: {
            duration: 300,
        },
    },
    exit: {
        opacity   : 0,
        transition: {
            duration: 300,
        },
    },
});

class PopoverBubble extends React.PureComponent {
    calculatePosition = (alignment, target_rectangle, margin) => {
        switch (alignment) {
            case 'top': return {
                left     : (target_rectangle.width / 2) + target_rectangle.left,
                bottom   : (window.innerHeight - target_rectangle.top) + margin,
                transform: 'translateX(-50%)',
            };
            case 'bottom': return {
                left     : (target_rectangle.width / 2) + target_rectangle.left,
                top      : target_rectangle.bottom + margin,
                transform: 'translateX(-50%)',
            };
            case 'left': return {
                right    : (window.innerWidth - target_rectangle.left) + margin,
                top      : (target_rectangle.height / 2) + target_rectangle.top,
                transform: 'translateY(-50%)',
            };
            case 'right': return {
                left     : target_rectangle.right + margin,
                top      : (target_rectangle.height / 2) + target_rectangle.top,
                transform: 'translateY(-50%)',
            };
            default: return {
                left: target_rectangle.left,
                top : target_rectangle.top,
            };
        }
    }

    render() {
        const {
            alignment,
            className,
            has_error,
            icon,
            is_open,
            margin = 0,
            message,
            target_rectangle,
        } = this.props;

        const popover_bubble = (
            <React.Fragment>
                { is_open &&
                    <PoseGroup>
                        <FadeIn key='fade_in' initialPose='exit'>
                            <span
                                style={this.calculatePosition(
                                    alignment,
                                    target_rectangle,
                                    margin,
                                )}
                                className={classNames(
                                    className,
                                    'popover__bubble',
                                    {
                                        [`popover__bubble--${alignment}`]: alignment,
                                        'popover__bubble--error'         : has_error,
                                    },
                                )}
                            >
                                <span className={classNames(
                                    'popover__bubble__arrow',
                                    alignment ? `popover__bubble__arrow--${alignment}` : '',
                                )}
                                />
                                { icon &&
                                    <i className='popover__bubble__icon'>
                                        {(icon === 'info')     && <Icon icon={IconInfoBlue} />}
                                        {(icon === 'question') && <Icon icon={IconQuestion} />}
                                        {(icon === 'dot')      && <Icon icon={IconRedDot} />}
                                    </i>
                                }
                                <span className='popover__bubble__text'>
                                    { message }
                                </span>
                            </span>
                        </FadeIn>
                    </PoseGroup>
                }
            </React.Fragment>
        );
        
        return ReactDOM.createPortal(
            popover_bubble,
            document.getElementById('binary_app')
        );
    }
}

PopoverBubble.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.node,
    className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
    icon   : PropTypes.string,
    margin : PropTypes.number,
    message: PropTypes.string,
};

export default PopoverBubble;
