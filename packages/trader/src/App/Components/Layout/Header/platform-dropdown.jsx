import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import ReactDOM       from 'react-dom';
import { BinaryLink } from 'App/Components/Routes';
import Icon           from 'Assets/icon.jsx';
import { isBot }      from 'Utils/PlatformSwitcher';
import 'Sass/app/_common/components/platform-dropdown.scss';

class PlatformDropdown extends React.PureComponent {
    handleClickOutside = (event) => {
        if (!event.target.closest('.platform_dropdown__list') && !event.target.closest('.platform_switcher')) {
            this.props.handleClick();
        }
    }

    componentWillMount() {
        window.addEventListener('popstate', this.props.handleClick);
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.props.handleClick);
        document.removeEventListener('click', this.handleClickOutside);
    }

    render() {
        const {
            platform_config,
            handleClick,
        } = this.props;
        const is_bot = isBot();

        const platform_dropdown = (
            <div className='platform_dropdown'>
                <div className='platform_dropdown__list'>
                    {platform_config.map((platform, idx) => (
                        <BinaryLink
                            to={platform.link_to}
                            href={platform.href}
                            key={idx}
                            onClick={handleClick}
                            className={classNames(
                                'platform_dropdown__list__platform',
                                { 'active': is_bot && platform.href === '/bot' }
                            )}
                        >
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
