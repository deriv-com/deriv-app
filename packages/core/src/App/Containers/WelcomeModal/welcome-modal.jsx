import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Modal, Icon, Button, ThemedScrollbars } from '@deriv/components';
import { routes } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const WelcomeColumn = ({
    button_text,
    className,
    description,
    icons,
    is_hovered,
    onButtonClick,
    onMouseEnter,
    onMouseLeave,
    platforms,
    title,
}) => {
    return (
        <div
            className={classNames('welcome-column', className)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className='welcome-column__icons'>
                {icons.map((icon, index) => (
                    <Icon className='welcome-column__icon' icon={icon} key={index} size={48} />
                ))}
            </div>
            <div className='welcome-column__title'>{title}</div>
            <div className='welcome-column__description'>{description}</div>
            <div className='welcome-column__platforms'>
                <p className='welcome-column__platforms__title'>{localize('Platforms')}</p>
                <div className='welcome-column__platforms__container'>
                    {platforms.map((platform, index) => (
                        <div className='welcome-column__platform' key={index}>
                            <Icon className='welcome-column__platform__icon' icon={platform.icon} size={32} />
                            <h3 className='welcome-column__platform__title'>{platform.title}</h3>
                            <p className='welcome-column__platform__description'>{platform.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Button
                className='welcome-column__button'
                onClick={onButtonClick}
                large
                primary={is_hovered}
                secondary={!is_hovered}
            >
                {button_text}
            </Button>
        </div>
    );
};

WelcomeColumn.propTypes = {
    button_text: PropTypes.string,
    description: PropTypes.string,
    icons: PropTypes.array,
    onButtonClick: PropTypes.func,
    platforms: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
};

const WelcomeModal = ({ toggleWelcomeModal, history }) => {
    const [hovered, setHovered] = React.useState(null);

    const switchPlatform = React.useCallback(
        route => {
            toggleWelcomeModal(false);
            history.push(route);
        },
        [toggleWelcomeModal, history]
    );

    return (
        <Modal
            width='760px'
            className='welcome'
            is_open={true}
            toggleModal={() => {}}
            has_close_icon={false}
            has_outer_content={true}
        >
            <ThemedScrollbars height={700}>
                <h2 className='welcome__title'>{localize('Where would you like to start?')}</h2>
                <div
                    className={classNames('welcome__message', 'welcome__message--left', {
                        'welcome__message--visible': hovered === 'left',
                    })}
                >
                    <p className='welcome__message__text'>{localize('The choice of professionals')}</p>
                    <Icon icon='IcArrowRightCurly' size={43} />
                </div>
                <div
                    className={classNames('welcome__message', 'welcome__message--right', {
                        'welcome__message--visible': hovered === 'right',
                    })}
                >
                    <Icon icon='IcArrowLeftCurly' size={43} />
                    <p className='welcome__message__text'>{localize('Not sure? try this')}</p>
                </div>
                <div className='welcome__body'>
                    <WelcomeColumn
                        button_text={localize('Start here')}
                        className='welcome-column--left'
                        description={localize(
                            'Trade with leverage and low spreads for better returns on successful trades.'
                        )}
                        icons={['IcPercentSolid']}
                        is_hovered={hovered === 'left'}
                        onButtonClick={() => switchPlatform(routes.mt5)}
                        platforms={[
                            {
                                icon: 'IcBrandDmt5',
                                title: localize('Deriv MetaTrader 5 (DMT5)'),
                                description: localize('The platform of choice for professionals.'),
                            },
                        ]}
                        title={localize('Margin (MetaTrader 5)')}
                        onMouseEnter={() => {
                            setHovered('left');
                        }}
                        onMouseLeave={() => {
                            setHovered(null);
                        }}
                    />
                    <WelcomeColumn
                        button_text={localize('Start here')}
                        className='welcome-column--right'
                        description={localize(
                            'Earn fixed payouts with options, or trade multipliers to combine the upside of margin trading with the simplicity of options.'
                        )}
                        icons={['IcUpDownSolid', 'IcCrossSolid']}
                        is_hovered={hovered === 'right'}
                        onButtonClick={() => switchPlatform(routes.trade)}
                        platforms={[
                            {
                                icon: 'IcBrandDtrader',
                                title: localize('DTrader'),
                                description: localize('Start trading with a powerful, yet easy-to-use platform.'),
                            },
                            {
                                icon: 'IcBrandDbot',
                                title: localize('DBot'),
                                description: localize('Automate your trading ideas without coding.'),
                            },
                        ]}
                        title={localize('Options & Multipliers')}
                        onMouseEnter={() => {
                            setHovered('right');
                        }}
                        onMouseLeave={() => {
                            setHovered(null);
                        }}
                    />
                </div>
                <p className='welcome__footer'>
                    {localize(
                        'Whatever you choose, you will always be able to access Margin or Options & Multipliers at any time'
                    )}
                </p>
            </ThemedScrollbars>
        </Modal>
    );
};

export default withRouter(
    connect(({ ui }) => ({
        toggleWelcomeModal: ui.toggleWelcomeModal,
    }))(WelcomeModal)
);
