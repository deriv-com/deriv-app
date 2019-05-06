import PropTypes     from 'prop-types';
import React         from 'react';
import PopoverBubble from './popover-bubble.jsx';

class Popover extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { is_open: false };
        this.popover_trigger_reference = React.createRef();
    }

    toggleIsOpen = () => this.setState({ is_open: !this.state.is_open });

    render() {
        const {
            alignment,
            children,
            message,
        } = this.props;

        return (
            <div
                className='popover'
                onMouseEnter={this.toggleIsOpen}
                onMouseLeave={this.toggleIsOpen}
            >
                <div
                    ref={this.popover_trigger_reference}
                    className='popover__trigger'
                >
                    { children }
                </div>
                { this.state.is_open &&
                    <PopoverBubble
                        className='popover__bubble'
                        alignment={alignment}
                        message={message}
                        popover_trigger_rectangle={this.popover_trigger_reference.current.getBoundingClientRect()}
                    />
                }
            </div>
        );
    }
}

Popover.propTypes = {
    alignment: PropTypes.string,
    children : PropTypes.node,
    message  : PropTypes.string,
};

export default Popover;
