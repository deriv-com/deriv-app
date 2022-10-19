import React from 'react';
import classnames from 'classnames';
import { Button, Icon, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

type TGoogleDrive = {
    is_authorised: boolean;
    is_open_button_loading: boolean;
    onDriveConnect: () => void;
    onDriveOpen: () => void;
    is_mobile: boolean;
};

const google_content = [
    localize("To import your bot from your Google Drive, you'll need to sign in to your Google account."),
    localize('To know how Google Drive handles your data, please review Deriv’s Privacy policy.'),
];

const GoogleDrive = ({
    is_authorised,
    is_open_button_loading,
    onDriveConnect,
    onDriveOpen,
    is_mobile,
}: TGoogleDrive) => {
    return (
        <div className='load-strategy__container'>
            <div className='load-strategy__google-drive'>
                <Icon
                    icon={'IcGoogleDrive'}
                    className={classnames('load-strategy__google-drive-icon', {
                        'load-strategy__google-drive-icon--disabled': !is_authorised,
                    })}
                    size={is_mobile ? 96 : 128}
                />

                <div className='load-strategy__google-drive-text'>
                    {is_authorised ? (
                        <Localize i18n_default_text='You are connected to Google Drive' />
                    ) : (
                        'Google Drive'
                    )}
                </div>
                {google_content.map(content => {
                    return (
                        <Text as='p' size='xs' line_height='l' key={content}>
                            {content}
                        </Text>
                    );
                })}
                {is_authorised ? (
                    <Button.Group>
                        <Button text={localize('Disconnect')} onClick={onDriveConnect} has_effect secondary large />
                        <Button
                            text={localize('Open')}
                            onClick={onDriveOpen}
                            is_loading={is_open_button_loading}
                            has_effect
                            primary
                            large
                        />
                    </Button.Group>
                ) : (
                    <React.Fragment>
                        <Button text={localize('Connect')} onClick={onDriveConnect} has_effect primary large />
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default connect(({ load_modal, ui, google_drive }: RootStore) => ({
    is_authorised: google_drive.is_authorised,
    is_mobile: ui.is_mobile,
    is_open_button_loading: load_modal.is_open_button_loading,
    onDriveConnect: load_modal.onDriveConnect,
    onDriveOpen: load_modal.onDriveOpen,
}))(GoogleDrive);
