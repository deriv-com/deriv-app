import React from 'react';
import { Icon } from '@deriv/components';
import { getStatusContent, PASSKEY_STATUS_CODES, TPasskeysStatus } from 'Sections/Security/Passkeys/passkeys-configs';
import PasskeysFooterButtons from './passkeys-footer-buttons';
import PasskeysStatus from './passkeys-status';

type TPasskeysStatusContainer = {
    createPasskey: () => void;
    passkey_status: TPasskeysStatus;
    setPasskeyStatus: (status: TPasskeysStatus) => void;
};

const PasskeysStatusContainer = ({ createPasskey, passkey_status, setPasskeyStatus }: TPasskeysStatusContainer) => {
    const [is_learn_more_opened, setIsLearnMoreOpened] = React.useState(false);

    if (passkey_status === PASSKEY_STATUS_CODES.NONE) return null;

    const content = getStatusContent(passkey_status, () => setIsLearnMoreOpened(true));

    let onButtonClick = () => setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
    let onBackButtonClick;

    if (passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE) {
        onButtonClick = createPasskey;
    }

    if (passkey_status === PASSKEY_STATUS_CODES.NO_PASSKEY) {
        onButtonClick = createPasskey;
        onBackButtonClick = () => {
            setIsLearnMoreOpened(true);
            setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE);
        };
    }

    if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
        //TODO implement renaming flow
        onBackButtonClick = () => setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
    }

    if (passkey_status === PASSKEY_STATUS_CODES.VERIFYING) {
        //TODO implement verifying flow (send email)
    }
    return (
        <div className='passkeys'>
            {is_learn_more_opened && (
                <Icon
                    icon='IcBackButton'
                    onClick={() => setIsLearnMoreOpened(false)}
                    className='passkeys-status__description-back-button'
                />
            )}
            <PasskeysStatus
                className={is_learn_more_opened ? 'passkeys-status__wrapper--expanded' : ''}
                icon={content.icon}
                title={content.title}
                description={content.description}
            >
                <PasskeysFooterButtons
                    button_text={content.button_text}
                    onButtonClick={onButtonClick}
                    back_button_text={content.back_button_text}
                    onBackButtonClick={onBackButtonClick}
                />
            </PasskeysStatus>
        </div>
    );
};

export default PasskeysStatusContainer;
