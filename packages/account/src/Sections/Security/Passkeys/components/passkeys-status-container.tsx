import React from 'react';
import { Icon } from '@deriv/components';
import { routes } from '@deriv/shared';
import {
    getStatusContent,
    PASSKEY_STATUS_CODES,
    passkeysMenuActionEventTrack,
    TPasskeysStatus,
} from '../passkeys-configs';
import PasskeysFooterButtons from './passkeys-footer-buttons';
import PasskeysStatus from './passkeys-status';
import { useHistory } from 'react-router-dom';

type TPasskeysStatusContainer = {
    createPasskey: () => void;
    passkey_status: TPasskeysStatus;
    setPasskeyStatus: (status: TPasskeysStatus) => void;
};

const PasskeysStatusContainer = ({ createPasskey, passkey_status, setPasskeyStatus }: TPasskeysStatusContainer) => {
    const history = useHistory();
    const prev_passkey_status = React.useRef<TPasskeysStatus>(PASSKEY_STATUS_CODES.NONE);

    if (passkey_status === PASSKEY_STATUS_CODES.NONE) return null;

    const onPrimaryButtonClick = () => {
        if (passkey_status === PASSKEY_STATUS_CODES.REMOVED) {
            passkeysMenuActionEventTrack('create_passkey_continue');
            // set status to 'NONE'  means 'continue' button is clicked
            setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
            return;
        }
        if (passkey_status === PASSKEY_STATUS_CODES.CREATED) {
            passkeysMenuActionEventTrack('create_passkey_continue_trading');
            history.push(routes.traders_hub);
            return;
        }
        // if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
        //     // TODO: implement renaming flow & add 'Save changes' action for onPrimaryButtonClick
        //     return;
        // }
        // if (passkey_status === PASSKEY_STATUS_CODES.VERIFYING) {
        //     // TODO: implement verifying flow and onPrimaryButtonClick action (send email)
        //     return;
        // }
        createPasskey();
    };

    const onSecondaryButtonClick = () => {
        if (passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE) {
            passkeysMenuActionEventTrack('info_back');
            setPasskeyStatus(prev_passkey_status.current);
            return;
        }

        if (passkey_status === PASSKEY_STATUS_CODES.CREATED) {
            passkeysMenuActionEventTrack('add_more_passkeys');
            setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
            return;
        }
        // if (passkey_status === PASSKEY_STATUS_CODES.RENAMING) {
        //     setPasskeyStatus(PASSKEY_STATUS_CODES.NONE);
        //     return;
        // }
        prev_passkey_status.current = passkey_status;
        passkeysMenuActionEventTrack('info_open');
        setPasskeyStatus(PASSKEY_STATUS_CODES.LEARN_MORE);
    };

    const content = getStatusContent(passkey_status);
    const is_learn_more_opened = passkey_status === PASSKEY_STATUS_CODES.LEARN_MORE;

    return (
        <div className='passkeys'>
            {is_learn_more_opened && (
                <Icon
                    icon='IcBackButton'
                    onClick={onSecondaryButtonClick}
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
                    primary_button_text={content.primary_button_text}
                    onPrimaryButtonClick={onPrimaryButtonClick}
                    secondary_button_text={content.secondary_button_text}
                    onSecondaryButtonClick={onSecondaryButtonClick}
                />
            </PasskeysStatus>
        </div>
    );
};

export default PasskeysStatusContainer;
