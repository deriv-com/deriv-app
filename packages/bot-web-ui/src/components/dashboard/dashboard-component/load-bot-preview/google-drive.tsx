import React from 'react';
import classnames from 'classnames';
import { Button, Icon, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { isMobile } from '@deriv/shared';
import RootStore from 'Stores/root-store';

type TGoogleDriveProps = {
    is_authorised: boolean;
    is_open_button_loading: boolean;
    onDriveConnect: () => void;
    onDriveOpen: () => void;
    setOpenSettings: (toast_message: string, show_toast?: boolean) => void;
};

const GoogleDrive = ({
    is_authorised,
    is_open_button_loading,
    onDriveConnect,
    onDriveOpen,
    setOpenSettings,
}: TGoogleDriveProps) => {
    return (
        <div className='load-strategy__container'>
            <div className='load-strategy__google-drive'>
                <Icon
                    icon={'IcGoogleDrive'}
                    className={classnames('load-strategy__google-drive-icon', {
                        'load-strategy__google-drive-icon--disabled': !is_authorised,
                    })}
                    size={isMobile() ? 96 : 128}
                />
                <div className='load-strategy__google-drive-connected-text'>
                    {is_authorised ? (
                        <Localize i18n_default_text='You are connected to Google Drive' />
                    ) : (
                        'Google Drive'
                    )}
                </div>
                {is_authorised ? (
                    <Button.Group>
                        <Button text={localize('Disconnect')} onClick={onDriveConnect} has_effect secondary large />
                        <Button
                            text={localize('Open')}
                            onClick={() => {
                                onDriveOpen();
                                setOpenSettings('import');
                            }}
                            is_loading={is_open_button_loading}
                            has_effect
                            primary
                            large
                        />
                    </Button.Group>
                ) : (
                    <React.Fragment>
                        <div className='load-strategy__google-drive-terms'>
                            <div className='load-strategy__google-drive-text'>
                                <Localize i18n_default_text="To import your bot from your Google Drive, you'll need to sign in to your Google account." />
                            </div>
                            <div className='load-strategy__google-drive-text'>
                                <Localize
                                    i18n_default_text='To know how Google Drive handles your data, please review Deriv’s <0>Privacy policy.</0>'
                                    components={[
                                        <StaticUrl
                                            key={0}
                                            className='link'
                                            href='tnc/security-and-privacy.pdf'
                                            is_document
                                        />,
                                    ]}
                                />
                            </div>
                        </div>
                        <Button text={localize('Sign in')} onClick={onDriveConnect} has_effect primary large />
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default connect(({ load_modal, google_drive, dashboard }: RootStore) => ({
    is_authorised: google_drive.is_authorised,
    is_open_button_loading: load_modal.is_open_button_loading,
    onDriveConnect: load_modal.onDriveConnect,
    onDriveOpen: load_modal.onDriveOpen,
    setOpenSettings: dashboard.setOpenSettings,
}))(GoogleDrive);
