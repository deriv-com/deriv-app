import React from 'react';
import classNames from 'classnames';
import { Text, Icon, MobileWrapper, DesktopWrapper } from '@deriv/components';

type WelcomeItemProps = {
    description: unknown;
    icon: unknown;
    mobileIcon: unknown;
    onClick: () => void;
    options: unknown;
    small: boolean;
    title: string;
};

const Options = ({ options }) => (
    <footer className='welcome-item__options'>
        {options.map(option => (
            <React.Fragment key={option}>
                <DesktopWrapper>
                    <Text size='xxxs' color='less-prominent' className='welcome-item__option'>
                        {option}
                    </Text>
                </DesktopWrapper>
                <MobileWrapper>
                    <Text size='xxxxs' color='less-prominent' className='welcome-item__option'>
                        {option}
                    </Text>
                </MobileWrapper>
            </React.Fragment>
        ))}
    </footer>
);

const WelcomeItem = ({ title, description, options, onClick, icon, mobileIcon, small }: WelcomeItemProps) => (
    <section
        className={classNames('welcome-item', {
            'welcome-item-small': small,
        })}
        onClick={onClick}
    >
        <div
            className={classNames('welcome-item__icon', {
                'welcome-item-small__icon': small,
            })}
        >
            <>
                <DesktopWrapper>{icon}</DesktopWrapper>
                <MobileWrapper>{mobileIcon}</MobileWrapper>
            </>
        </div>
        <div className='welcome-item__body'>
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
                {options && options.length && <Options options={options} />}
            </main>
            <div className='welcome-item__arrow'>
                <Icon icon='IcChevronRight' size={16} />
            </div>
        </div>
    </section>
);

export default WelcomeItem;
