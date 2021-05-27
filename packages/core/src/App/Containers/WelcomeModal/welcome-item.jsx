import React from 'react';
import PropTypes from 'prop-types';
import { Text, Icon, MobileWrapper, DesktopWrapper } from '@deriv/components';

const Options = ({ options }) => (
    <footer className='welcome-item__options'>
        {options.map(option => (
            <>
                <DesktopWrapper>
                    <Text key={option} size='xxxs' color='less-prominent' className='welcome-item__option'>
                        {option}
                    </Text>
                </DesktopWrapper>
                <MobileWrapper>
                    <Text key={option} size='xxxxs' color='less-prominent' className='welcome-item__option'>
                        {option}
                    </Text>
                </MobileWrapper>
            </>
        ))}
    </footer>
);

const WelcomeItem = ({ title, description, options, onClick, icon }) => (
    <section className='welcome-item' onClick={onClick}>
        <div className='welcome-item__icon'>{icon}</div>
        <div className='welcome-item__body'>
            <div className='welcome-item__main-wrapper'>
                <main className='welcome-item__main'>
                    <DesktopWrapper>
                        <Text as='h3' weight='bold' color='prominent' size='sm'>
                            {title}
                        </Text>
                        <Text as='p' color='prominent'>
                            {description}
                        </Text>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <Text as='h3' weight='bold' color='prominent' size='s'>
                            {title}
                        </Text>
                        <Text as='p' color='prominent' size='xs'>
                            {description}
                        </Text>
                    </MobileWrapper>
                </main>
                <div className='welcome-item__arrow'>
                    <Icon icon='IcChevronRight' size={16} />
                </div>
            </div>
            {options && options.length && <Options options={options} />}
        </div>
    </section>
);

WelcomeItem.propTypes = {
    description: PropTypes.element.isRequired,
    icon: PropTypes.element.isRequired,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
};

export default WelcomeItem;
