import React            from 'react';
import PropTypes        from 'prop-types';
import posed            from 'react-pose';
import { PlatformList } from './platform-list.jsx';

const FadeInFromTop = posed.div({
    popped: {
        x         : -10,
        y         : -10,
        background: 'rgba(161, 0, 246, 1)',
        boxShadow : '10px 10px 20px rgba(161, 0, 246, 0.2)',
        transition: { duration: 700 },
    },
});

class PlatformSwitcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = { is_open: false };
    }

    handleClick = () => this.setState({ is_open: !this.state.is_open });

    render() {
        return (
            <React.Fragment>
                <button onClick={this.handleClick} />

                { this.state.is_open &&
                <FadeInFromTop pose='popped'>
                    <PlatformList platform_config={this.props.platform_config} />
                </FadeInFromTop>
                }
            </React.Fragment>
        );
    }
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export { PlatformSwitcher };
