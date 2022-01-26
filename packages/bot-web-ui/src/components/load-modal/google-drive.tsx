import classnames from 'classnames';
import React from 'react';
import { Button, Icon, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

type GoogleDriveProps = {
    is_authorised: boolean;
    is_mobile: boolean;
    is_open_button_loading: boolean;
    onDriveConnect: () => void;
    onDriveOpen: () => void;
};

const GoogleDrive = ({
    is_authorised,
    is_open_button_loading,
    onDriveConnect,
    onDriveOpen,
    is_mobile,
}: GoogleDriveProps) => {
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
                        <div className='load-strategy__google-drive-terms'>
                            <Localize
                                i18n_default_text="Find out how this app handles your data by reviewing Deriv's <0>Privacy policy</0>, which is part of Deriv's <1>Terms and conditions</2>."
                                components={[
                                    <StaticUrl
                                        key={0}
                                        className='link'
                                        href='tnc/security-and-privacy.pdf'
                                        is_document
                                    />,
                                    <StaticUrl key={1} className='link' href='terms-and-conditions' />,
                                ]}
                            />
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default connect(({ load_modal, ui, google_drive }) => ({
    is_authorised: google_drive.is_authorised,
    is_mobile: ui.is_mobile,
    is_open_button_loading: load_modal.is_open_button_loading,
    onDriveConnect: load_modal.onDriveConnect,
    onDriveOpen: load_modal.onDriveOpen,
}))(GoogleDrive);
