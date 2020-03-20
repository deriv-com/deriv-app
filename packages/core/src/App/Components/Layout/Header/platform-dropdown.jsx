import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@deriv/components';
import { BinaryLink } from 'App/Components/Routes';
import routes from 'Constants/routes';
import 'Sass/app/_common/components/platform-dropdown.scss';

const PlatformBox = ({ platform: { icon, title, description } }) => (
    <>
        <div className='platform_dropdown__list__platform__background' />
        <Icon className='platform_dropdown__list__platform__icon' icon={icon} size={32} />

        <div className='platform_dropdown__list__platform__details'>
            <p className='platform_dropdown__list__platform__title'>{title}</p>
            <p className='platform_dropdown__list__platform__description'>{description}</p>
        </div>
    </>
);
class PlatformDropdown extends React.PureComponent {
    handleClickOutside = event => {
        if (!event.target.closest('.platform_dropdown__list') && !event.target.closest('.platform_switcher')) {
            this.props.closeDrawer();
        }
    };

    componentWillMount() {
        window.addEventListener('popstate', this.props.closeDrawer);
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.props.closeDrawer);
        document.removeEventListener('click', this.handleClickOutside);
    }

    render() {
        const { platform_config, closeDrawer } = this.props;

        const platform_dropdown = (
            <div className='platform_dropdown'>
                <div className='platform_dropdown__list'>
                    {platform_config.map((platform, idx) => (
                        <div key={idx} onClick={closeDrawer}>
                            {platform.link_to !== undefined ? (
                                <BinaryLink
                                    to={platform.link_to}
                                    // This is here because in routes-config it needs to have children, but not in menu
                                    exact={platform.link_to === routes.trade}
                                    className='platform_dropdown__list__platform'
                                >
                                    <PlatformBox platform={platform} />
                                </BinaryLink>
                            ) : (
                                <a href={platform.href} className='platform_dropdown__list__platform'>
                                    <PlatformBox platform={platform} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );

        return ReactDOM.createPortal(platform_dropdown, document.getElementById('deriv_app'));
    }
}

PlatformDropdown.propTypes = {
    platform_configs: PropTypes.array,
};

export { PlatformDropdown };
