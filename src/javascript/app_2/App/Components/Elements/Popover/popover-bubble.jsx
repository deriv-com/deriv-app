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

    getHorizontalCenter = rectangle => rectangle.left + (rectangle.width / 2);

    getVerticalCenter = rectangle => rectangle.top + (rectangle.height / 2);

    getBubblePositionStyle = (alignment, popover_trigger_rectangle) => {
        switch (alignment) {
            case 'top': return {
                left     : this.getHorizontalCenter(popover_trigger_rectangle),
                transform: 'translateX(-50%)',
                bottom   : `calc(100% - ${popover_trigger_rectangle.top}px)`,
            };
            case 'right': return {
                left     : popover_trigger_rectangle.x + popover_trigger_rectangle.width,
                top      : this.getVerticalCenter(popover_trigger_rectangle),
                transform: 'translateY(-50%)',
            };
            case 'bottom': return {
                left     : this.getHorizontalCenter(popover_trigger_rectangle),
                transform: 'translateX(-50%)',
                top      : popover_trigger_rectangle.y + popover_trigger_rectangle.height,
            };
            case 'left': return {
                right    : `calc(100% - ${popover_trigger_rectangle.left}px)`,
                top      : this.getVerticalCenter(popover_trigger_rectangle),
                transform: 'translateY(-50%)',
            };
            default: return {
                left: popover_trigger_rectangle.x,
                top : popover_trigger_rectangle.y,
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
                        style={this.getBubblePositionStyle(
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
