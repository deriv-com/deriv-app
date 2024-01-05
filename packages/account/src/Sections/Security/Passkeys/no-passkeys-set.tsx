import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import PasskeysStatus from './passkeys-status';

type TNoPasskeysDescription = { onClick: (is_expanded: boolean) => void };

const NoPasskeysDescription = ({ onClick }: TNoPasskeysDescription) => (
    <PasskeysStatus
        icon='IcAddPasskey'
        title={<Localize i18n_default_text='No passkey set' />}
        description={
            <Localize
                i18n_default_text="You haven't set a passkey yet. To enhance your security, tap 'Create Passkey' below. Uncertain about passkeys? <0>Learn more</0>."
                components={[<Text key={0} color='loss-danger' size='xs' onClick={() => onClick(true)} />]}
            />
        }
    />
);

const TipsBlock = () => {
    const tips = [
        {
            id: 1,
            description: <Localize i18n_default_text='Has screen lock set up.' />,
        },
        {
            id: 2,
            description: <Localize i18n_default_text='Signed in to Google account for Android, and iCloud for iOS.' />,
        },
        {
            id: 3,
            description: <Localize i18n_default_text='Has bluetooth turned on if you want to use on another device.' />,
        },
    ];
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

const ExpandedPasskeysDescription = () => {
    const passkeys_descriptions = [
        {
            id: 1,
            question: <Localize i18n_default_text='What are Passkeys?' />,
            description: (
                <Localize i18n_default_text='Passkey are encrypted digital keys you create using your fingerprints, face or screen lock. ' />
            ),
        },
        {
            id: 2,
            question: <Localize i18n_default_text='Where are Passkeys saved?' />,
            description: (
                <Localize i18n_default_text='Passkey are saved to your password manager, so you can sign in on other devices.' />
            ),
        },
        {
            id: 3,
            question: <Localize i18n_default_text='Why do you need a Passkeys?' />,
            description: (
                <Localize i18n_default_text='A passkey is crucial for security, granting authorized access while keeping unauthorized users out, enhancing data protection.' />
            ),
        },
        {
            id: 4,
            question: <Localize i18n_default_text='How to create Passkeys?' />,
            description: (
                <Localize i18n_default_text='Simply go to "Account Settings" and follow the instructions in the "Passkey" section. Note that Android allows only one passkey per device, while iOS users can save multiple passkeys for different devices.' />
            ),
        },
        {
            id: 5,
            question: <Localize i18n_default_text='What if I change my Deriv account email?' />,
            description: (
                <Localize i18n_default_text='If you update your Deriv account email, your passkey remains unaffected, and you can continue using it to log in.' />
            ),
        },
    ];
    return (
        <PasskeysStatus
            className='passkeys-status__wrapper--expanded'
            icon='IcInfoPasskey'
            title={<Localize i18n_default_text='Passwordless login with passkeys' />}
        >
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
            <TipsBlock />
        </PasskeysStatus>
    );
};

const NoPasskeysSet = () => {
    const [is_expanded, setIsExpanded] = React.useState(false);

    return (
        <React.Fragment>
            {is_expanded ? <ExpandedPasskeysDescription /> : <NoPasskeysDescription onClick={setIsExpanded} />}
            <FormFooter>
                <Button type='button' has_effect primary>
                    <Localize i18n_default_text='Create passkey' />
                </Button>
            </FormFooter>
        </React.Fragment>
    );
};

export default NoPasskeysSet;
