import PropTypes        from 'prop-types';
import React            from 'react';
import { PlatformList } from './platform-list.jsx';

class PlatformSwitcher extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { is_open: false };
    }

    handleClick = () => this.setState({ is_open: !this.state.is_open });

    render = () => (
        <React.Fragment>
            <button onClick={this.handleClick} />
            <PlatformList
                platform_config={this.props.platform_config}
                handleClick={this.handleClick}
                is_open={this.state.is_open}
            />
        </React.Fragment>
    );
}

PlatformSwitcher.propTypes = {
    platform_config: PropTypes.array,
};

export { PlatformSwitcher };
