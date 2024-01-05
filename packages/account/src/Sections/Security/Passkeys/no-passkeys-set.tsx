import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import FormFooter from '../../../Components/form-footer';
import { getPasskeysDescriptions, getPasskeysTips } from './passkeys-content';
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

const ExpandedPasskeysDescription = () => {
    const passkeys_descriptions = getPasskeysDescriptions();
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
