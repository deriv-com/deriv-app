import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getPasskeysDescriptions, getPasskeysTips } from './passkeys-content';
import PasskeysStatus from './passkeys-status';

const TipsBlock = () => {
    const tips = getPasskeysTips();
    return (
        <div className='passkeys-status__description-tips-wrapper'>
            <Icon icon='IcBulb' size={24} />
            <div className='passkeys-status__description-tips-container'>
                <Text weight='bold' size='xs'>
                    <Localize i18n_default_text='Tips:' />
                </Text>
                <Text size='xxs' line_height='l'>
                    <Localize i18n_default_text='Before using passkey, please make sure your device:' />
                </Text>
                {tips.map(({ id, description }) => (
                    <li key={`tip-${id}`}>
                        <Text size='xxs' line_height='l'>
                            {description}
                        </Text>
                    </li>
                ))}
            </div>
        </div>
    );
};

const DescriptionContainer = () => {
    const passkeys_descriptions = getPasskeysDescriptions();
    return (
        <React.Fragment>
            <div className='passkeys-status__description-container'>
                {passkeys_descriptions.map(({ id, question, description }) => (
                    <div key={`description-${id}`} className='passkeys-status__description-card'>
                        <Text weight='bold' size='xs'>
                            {question}
                        </Text>
                        <Text size='xs'>{description}</Text>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
};

const getPasskeysNotSetContent = (is_expanded: boolean, onLearnMoreClick: () => void) => ({
    class_name: is_expanded ? 'passkeys-status__wrapper--expanded' : '',
    icon: is_expanded ? 'IcInfoPasskey' : 'IcAddPasskey',
    title: is_expanded ? (
        <Localize i18n_default_text='Passwordless login with passkeys' />
    ) : (
        <Localize i18n_default_text='No passkey set' />
    ),
    description: is_expanded ? undefined : (
        <Localize
            i18n_default_text="You haven't set a passkey yet. To enhance your security, tap 'Create passkey' below. Uncertain about passkeys? <0>Learn more</0>."
            components={[<Text key={0} color='loss-danger' size='xs' onClick={onLearnMoreClick} />]}
        />
    ),
});

const NoPasskeysSet = ({ onButtonClick }: { onButtonClick: () => void }) => {
    const [is_expanded, setIsExpanded] = React.useState(false);
    const onLearnMoreClick = () => setIsExpanded(!is_expanded);
    const status_content = getPasskeysNotSetContent(is_expanded, onLearnMoreClick);

    return (
        <React.Fragment>
            {is_expanded && (
                <Icon
                    icon='IcBackButton'
                    onClick={onLearnMoreClick}
                    className='passkeys-status__description-back-button'
                />
            )}
            <PasskeysStatus
                className={status_content.class_name}
                icon={status_content.icon}
                title={status_content.title}
                button_text={<Localize i18n_default_text='Create passkey' />}
                onButtonClick={onButtonClick}
                description={status_content.description}
            >
                {is_expanded && (
                    <React.Fragment>
                        <DescriptionContainer />
                        <TipsBlock />
                    </React.Fragment>
                )}
            </PasskeysStatus>
        </React.Fragment>
    );
};

export default NoPasskeysSet;
