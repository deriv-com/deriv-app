import React from 'react';
import { translate } from '@i18n';
import GoogleDriveIntegration from '@components/GoogleDriveIntegration';
import Dialog from './Dialog';
import * as style from '../style';

const IntegrationsContent = () => (
    <div id='integrations-dialog' className='dialog-content' style={style.content}>
        <GoogleDriveIntegration />
    </div>
);

export default class IntegrationsDialog extends Dialog {
    constructor() {
        const closeDialog = () => {
            this.close();
        };
        super(
            'integrations-dialog',
            translate('Google Drive Integration'),
            <IntegrationsContent closeDialog={closeDialog} />,
            {
                width: 500,
                height: 'auto',
            }
        );
        this.registerCloseOnOtherDialog();
    }
}
