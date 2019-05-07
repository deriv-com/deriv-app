import PropTypes     from 'prop-types';
import React         from 'react';
import PopoverBubble from './popover-bubble.jsx';

class Popover extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { is_open: false };
        this.trigger_reference = React.createRef();
    }

    toggleIsOpen = () => this.setState({ is_open: !this.state.is_open });

    render() {
        const {
            alignment,
            children,
            className,
            has_error,
            icon,
            message,
        } = this.props;

        return (
            <div
                className='popover'
                onMouseEnter={this.toggleIsOpen}
                onMouseLeave={this.toggleIsOpen}
            >
                <div className='popover__trigger' ref={this.trigger_reference}>
                    { children }
                </div>

                <PopoverBubble
                    alignment={alignment}
                    className={className}
                    has_error={has_error}
                    icon={icon}
                    is_open={(has_error || this.state.is_open) && this.trigger_reference.current}
                    trigger_reference={this.trigger_reference}
                    message={message}
                />
            </div>
        );
    }
}

Popover.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.node,
    className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
    has_error: PropTypes.bool,
    icon     : PropTypes.string,
    message  : PropTypes.string,
};

export default Popover;
