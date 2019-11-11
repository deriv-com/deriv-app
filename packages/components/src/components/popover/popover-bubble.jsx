import classNames           from 'classnames';
import PropTypes            from 'prop-types';
import React                from 'react';
import ReactDOM             from 'react-dom';
import IconInfoBlue         from '../icon-info-blue.jsx';

class PopoverBubble extends React.PureComponent {
    isBubbleOutOfBoundary = (position, width) => window.innerWidth < (position + width);

    calculateBubblePosition = () => {
        const { alignment, target_rectangle, margin = 0 } = this.props;

        switch (alignment) {
            case 'top': return {
                left: this.isBubbleOutOfBoundary(target_rectangle.left, 200)
                    ? window.innerWidth - 200
                    : (target_rectangle.width / 2) + target_rectangle.left,
                bottom     : (window.innerHeight - target_rectangle.top) + margin,
                marginRight: 10,
                transform  : this.isBubbleOutOfBoundary(target_rectangle.left, 200) ? '' : 'translateX(-50%)',
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
    };

    render() {
        const {
            alignment,
            className,
            has_error,
            icon,
            id,
            message,
            target_rectangle,
            portal_container,
        } = this.props;

        if (!target_rectangle) return null;

        return ReactDOM.createPortal(
            <span
                style={ this.calculateBubblePosition()}
                data-popover-pos={alignment}
                className={classNames(
                    className,
                    'dc-popover__bubble',
                    { 'dc-popover__bubble--error': has_error },
                )}
                id={id || ''}
            >
                { icon === 'info' &&
                    <i className='dc-popover__bubble__icon'>
                        <IconInfoBlue />
                    </i>
                }

                <span className='dc-popover__bubble__text'>
                    { message }
                </span>
                <span style={{ left: this.isBubbleOutOfBoundary(target_rectangle.left, 200) ? ((target_rectangle.width / 2) + target_rectangle.left) - (window.innerWidth - 200) : '' }} className='dc-popover__bubble__arrow' />
            </span>,
            document.getElementById(portal_container)
        );
    }
}

PopoverBubble.propTypes = {
    alignment       : PropTypes.string,
    children        : PropTypes.node,
    className       : PropTypes.string,
    has_error       : PropTypes.bool,
    icon            : PropTypes.string,
    id              : PropTypes.string,
    is_open         : PropTypes.bool,
    margin          : PropTypes.number,
    message         : PropTypes.string.isRequired,
    target_rectangle: PropTypes.object,
};

export default PopoverBubble;
