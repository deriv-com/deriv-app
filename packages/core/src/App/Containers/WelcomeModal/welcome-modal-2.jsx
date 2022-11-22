import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'Stores/connect';
import { Modal, Carousel, Icon, Button, ThemedScrollbars, Text } from '@deriv/components';
import { routes, isMobile, getPlatformSettings } from '@deriv/shared';
import { localize } from '@deriv/translations';

const WelcomeColumn = ({
    className,
    description,
    footer_text,
    icons,
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
                <Text
                    as='p'
                    color='prominent'
                    weight='bold'
                    size='xs'
                    className='welcome-column__platforms__title'
                    align={isMobile() ? 'center' : ''}
                >
                    {localize('Platforms')}
                </Text>
                <div className='welcome-column__platforms__container'>
                    {platforms.map((platform, index) =>
                        platform ? (
                            <React.Fragment key={index}>
                                <div className='welcome-column__platform'>
                                    <Icon className='welcome-column__platform__icon' icon={platform.icon} size={32} />
                                    <Text
                                        as='h3'
                                        weight='bold'
                                        align='center'
                                        color='prominent'
                                        size='xs'
                                        className='welcome-column__platform__title'
                                    >
                                        {platform.title}
                                    </Text>
                                    <Text
                                        as='p'
                                        color='less-prominent'
                                        size='xxs'
                                        align='left'
                                        className='welcome-column__platform__description'
                                    >
                                        {platform.description}
                                    </Text>
                                </div>
                                <div
                                    className={classNames('welcome-column__platform-footer', {
                                        'welcome-column__platform-footer--has-separator': index === 0,
                                    })}
                                >
                                    <Button
                                        className='welcome-column__platform-button'
                                        onClick={platform.onButtonClick}
                                        secondary
                                        large
                                    >
                                        {platform.button_text}
                                    </Button>
                                </div>
                            </React.Fragment>
                        ) : null
                    )}
                </div>
            </div>
            <div className='welcome-column__footer'>
                {footer_text && (
                    <Text as='p' size='xxs' color='less-prominent' className='welcome-column__footer__text'>
                        {footer_text}
                    </Text>
                )}
            </div>
        </div>
    );
};

const footer_text = localize('You can switch between CFDs, digital options, and multipliers at any time.');

WelcomeColumn.propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    footer_text: PropTypes.string,
    icons: PropTypes.array,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    platforms: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
};

const WelcomeModal = ({ toggleWelcomeModal, history, is_bot_allowed, is_dxtrade_allowed }) => {
    const [hovered, setHovered] = React.useState(null);
    const [column_width, setColumnWidth] = React.useState(320);
    const carouselRef = React.useRef(null);
    const switchPlatform = React.useCallback(
        route => {
            toggleWelcomeModal({ is_visible: false, should_persist: true });
            history.push(route);
        },
        [toggleWelcomeModal, history]
    );

    React.useEffect(() => {
        setColumnWidth(carouselRef.current.offsetWidth);
    }, [carouselRef]);

    const getLeftPlatforms = () => {
        const platforms = [
            {
                icon: getPlatformSettings('mt5').icon,
                title: localize('Deriv MT5'),
                description: localize(
                    'Trade on Deriv MT5 ({{platform_name_dmt5}}), the all-in-one FX and CFD trading platform.',
                    { platform_name_dmt5: getPlatformSettings('dmt5').name }
                ),
                onButtonClick: () => switchPlatform(routes.mt5),
                button_text: localize('Trade on MT5'),
            },
        ];

        if (is_dxtrade_allowed) {
            platforms.push({
                icon: getPlatformSettings('dxtrade').icon,
                title: localize('{{platform_name_dxtrade}}', {
                    platform_name_dxtrade: getPlatformSettings('dxtrade').name,
                }),
                description: localize('Trade FX and CFDs on a customisable, easy-to-use trading platform.'),
                onButtonClick: () => switchPlatform(routes.dxtrade),
                button_text: localize('Trade on {{platform_name_dxtrade}}', {
                    platform_name_dxtrade: getPlatformSettings('dxtrade').name,
                }),
            });
        }
        return platforms;
    };

    const Cards = [
        <WelcomeColumn
            key={0}
            className='welcome-column--left'
            description={localize('Trade with leverage and low spreads for better returns on successful trades.')}
            icons={['IcPercentSolid']}
            is_hovered={hovered === 'left'}
            platforms={getLeftPlatforms()}
            title={localize('CFDs')}
            onMouseEnter={() => {
                setHovered('left');
            }}
            onMouseLeave={() => {
                setHovered(null);
            }}
            footer_text={footer_text}
        />,
        <WelcomeColumn
            key={1}
            className='welcome-column--right'
            description={localize(
                'Earn fixed payouts with options, or trade multipliers to amplify your gains with limited risk.'
            )}
            icons={['IcUpDownSolid', 'IcCrossSolid']}
            is_hovered={hovered === 'right'}
            onButtonClick={() => switchPlatform(routes.trade)}
            platforms={[
                {
                    icon: getPlatformSettings('trader').icon,
                    title: getPlatformSettings('trader').name,
                    description: localize('Our flagship options and multipliers trading platform.'),
                    onButtonClick: () => switchPlatform(routes.trade),
                    button_text: localize('Trade on {{platform_name_trader}}', {
                        platform_name_trader: getPlatformSettings('trader').name,
                    }),
                },
                is_bot_allowed
                    ? {
                          icon: getPlatformSettings('dbot').icon,
                          title: getPlatformSettings('dbot').name,
                          description: localize('Automate your trading, no coding needed.'),
                          onButtonClick: () => switchPlatform(routes.bot),
                          button_text: localize('Trade on {{platform_name_dbot}}', {
                              platform_name_dbot: getPlatformSettings('dbot').name,
                          }),
                      }
                    : null,
            ]}
            title={localize('Options & Multipliers')}
            onMouseEnter={() => {
                setHovered('right');
            }}
            onMouseLeave={() => {
                setHovered(null);
            }}
            footer_text={footer_text}
        />,
    ];

    return (
        <Modal width='760px' className='welcome' is_open has_close_icon={false} has_outer_content>
            <ThemedScrollbars height={700}>
                <Text as='h2' weight='bold' align='center' color='prominent' className='welcome__title'>
                    {localize('Where would you like to start?')}
                </Text>
                <div
                    className={classNames('welcome__message', 'welcome__message--left', {
                        'welcome__message--visible': hovered === 'left',
                    })}
                >
                    <Text
                        as='p'
                        color='colored-background'
                        weight='bold'
                        align='left'
                        className='welcome__message__text'
                    >
                        {localize("If you're looking for CFDs")}
                    </Text>
                    <Icon icon='IcArrowRightCurly' size={43} />
                </div>
                <div
                    className={classNames('welcome__message', 'welcome__message--right', {
                        'welcome__message--visible': hovered === 'right',
                    })}
                >
                    <Icon icon='IcArrowLeftCurly' size={43} />
                    <Text
                        as='p'
                        color='colored-background'
                        weight='bold'
                        align='left'
                        className='welcome__message__text'
                    >
                        {localize('Not sure? Try this')}
                    </Text>
                </div>
                <div className='welcome__body' ref={carouselRef}>
                    {isMobile() ? (
                        <Carousel show_nav={false} list={Cards} width={column_width} className='welcome__carousel' />
                    ) : (
                        Cards
                    )}
                </div>
                <Text as='p' size='xxs' color='less-prominent' className='welcome__footer'>
                    {footer_text}
                </Text>
            </ThemedScrollbars>
        </Modal>
    );
};

export default withRouter(
    connect(({ ui, client }) => ({
        toggleWelcomeModal: ui.toggleWelcomeModal,
        is_bot_allowed: client.is_bot_allowed,
        is_dxtrade_allowed: client.is_dxtrade_allowed,
    }))(WelcomeModal)
);
