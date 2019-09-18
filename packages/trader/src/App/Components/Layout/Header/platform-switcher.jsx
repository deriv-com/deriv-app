import PropTypes    from 'prop-types';
import React        from 'react';
import Icon         from 'Assets/icon.jsx';

class PlatformSwitcher extends React.Component {
    render() {
        const selected = {
            icon : 'IconDTrader',
            title: 'DTrader',
        };

        return (
            <React.Fragment>
                <div>
                    <Icon icon={selected.icon} />
                    <p>{selected.title}</p>
                    <p>Beta</p>
                </div>

                <div>
                    {this.props.platform_config.map((platform) => (
                        <div c={platform} key='plat' />
                    ))}
                </div>
            </React.Fragment>
        );
    }
}

PlatformSwitcher.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformSwitcher };
