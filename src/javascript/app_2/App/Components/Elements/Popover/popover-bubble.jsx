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
    getPopoverBubblePosition = (alignment, popover_trigger_rectangle) => {
        switch (alignment) {
            case 'top': return {
                left     : popover_trigger_rectangle.left + (popover_trigger_rectangle.width / 2),
                bottom   : `calc(100% - ${popover_trigger_rectangle.top}px)`,
                transform: 'translateX(-50%)',
            };
            case 'bottom': return {
                left     : popover_trigger_rectangle.left + (popover_trigger_rectangle.width / 2),
                top      : popover_trigger_rectangle.bottom,
                transform: 'translateX(-50%)',
            };
            case 'left': return {
                right    : `calc(100% - ${popover_trigger_rectangle.left}px)`,
                top      : popover_trigger_rectangle.top + (popover_trigger_rectangle.height / 2),
                transform: 'translateY(-50%)',
            };
            case 'right': return {
                left     : popover_trigger_rectangle.right,
                top      : popover_trigger_rectangle.top + (popover_trigger_rectangle.height / 2),
                transform: 'translateY(-50%)',
            };
            default: return {
                left: popover_trigger_rectangle.left,
                top : popover_trigger_rectangle.top,
            };
        }
    }

    render() {
        const {
            alignment,
            icon,
            message,
            popover_trigger_rectangle,
        } = this.props;
        
        return ReactDOM.createPortal(
            <PoseGroup>
                <FadeIn key='fade_in' initialPose='exit'>
                    <span
                        style={this.getPopoverBubblePosition(
                            alignment,
                            popover_trigger_rectangle,
                        )}
                        className={classNames(
                            'popover__bubble',
                            alignment ? `popover__bubble--${alignment}` : '',
                        )}
                    >
                        <span className={classNames(
                            'popover__bubble__arrow',
                            alignment ? `popover__bubble__arrow--${alignment}` : '',
                        )}
                        />
                        { icon &&
                            <span className='popover__bubble__icon'>
                                {(icon === 'info')     && <Icon icon={IconInfoBlue} />}
                                {(icon === 'question') && <Icon icon={IconQuestion} />}
                                {(icon === 'dot')      && <Icon icon={IconRedDot} />}
                            </span>
                        }
                        { message }
                    </span>
                </FadeIn>
            </PoseGroup>,
            document.getElementById('binary_app')
        );
    }
}

PopoverBubble.propTypes = {
    alignment                : PropTypes.string,
    children                 : PropTypes.node,
    message                  : PropTypes.string,
    tooltip_trigger_rectangle: PropTypes.object,
};

export default PopoverBubble;
