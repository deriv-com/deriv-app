import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import ReactDOM       from 'react-dom';
import { BinaryLink } from 'App/Components/Routes';
import routes         from 'Constants/routes';
import Icon           from 'Assets/icon.jsx';
import 'Sass/app/_common/components/platform-dropdown.scss';

class PlatformDropdown extends React.PureComponent {
    handleClickOutside = (event) => {
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
        const {
            platform_config,
            closeDrawer,
        } = this.props;

        const platform_dropdown = (
            <div className='platform_dropdown'>
                <div className='platform_dropdown__list'>
                    {platform_config.map((platform, idx) => (
                        <BinaryLink
                            to={platform.link_to}
                            // This is here because in routes-config it needs to have children, but not in menu
                            exact={ platform.link_to === routes.trade }
                            key={idx}
                            onClick={closeDrawer}
                            className={classNames(
                                'platform_dropdown__list__platform',
                            )}
                        >
                            <div className='platform_dropdown__list__platform__background' />
                            <Icon className='platform_dropdown__list__platform__icon' icon={platform.icon} />

                            <div className='platform_dropdown__list__platform__details'>
                                <p className='platform_dropdown__list__platform__title'>{platform.title}</p>
                                <p className='platform_dropdown__list__platform__description'>{platform.description}</p>
                            </div>
                        </BinaryLink>
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
