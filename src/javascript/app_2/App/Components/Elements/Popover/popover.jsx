import PropTypes     from 'prop-types';
import React         from 'react';
import PopoverBubble from './popover-bubble.jsx';

class Popover extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { is_open: false };
        this.popover_trigger_reference = React.createRef();
    }

    onMouseEnter = () => this.setState({ is_open: true });
    onMouseLeave = () => this.setState({ is_open: false });

    render() {
        const {
            alignment,
            children,
            message,
        } = this.props;

        return (
            <div
                className='popover'
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
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
