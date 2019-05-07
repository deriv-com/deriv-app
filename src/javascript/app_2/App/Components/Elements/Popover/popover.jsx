import PropTypes     from 'prop-types';
import React         from 'react';
import PopoverBubble from './popover-bubble.jsx';

class Popover extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_open          : false,
            trigger_rectangle: null,
        };
        this.trigger_reference = React.createRef();
    }

    componentDidMount() {
        this.setState({ trigger_rectangle: this.getTriggerRectangle() });
    }

    getTriggerRectangle = () => this.trigger_reference.current.getBoundingClientRect();
    toggleIsOpen = () => {
        this.setState({ is_open: !this.state.is_open });
        this.setState({ trigger_rectangle: this.getTriggerRectangle() });
    }

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
                ref={this.trigger_reference}
                onMouseEnter={this.toggleIsOpen}
                onMouseLeave={this.toggleIsOpen}
            >
                { children }
                
                { ((this.state.is_open || has_error) && this.state.trigger_rectangle) &&
                    <PopoverBubble
                        alignment={alignment}
                        className={className}
                        has_error={has_error}
                        icon={icon}
                        popover_trigger_rectangle={this.state.trigger_rectangle}
                        message={message}
                    />
                }
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
