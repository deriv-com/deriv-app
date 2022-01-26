import * as React from 'react';
import { createPortal } from 'react-dom';
import { AppSettings, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ApiTokenContext from './api-token-context';

const ApiTokenFooter = () => {
    const { footer_ref, toggleOverlay } = React.useContext(ApiTokenContext);

    return createPortal(
        <AppSettings.Footer>
            <AppSettings.Footer.Left>
                <a className='link link--prominent' onClick={toggleOverlay}>
                    <Text size='xxs' line_height='m' weight='bold'>
                        <Localize i18n_default_text='Learn more about API token' />
                    </Text>
                </a>
            </AppSettings.Footer.Left>
        </AppSettings.Footer>,
        footer_ref
    );
};

export default ApiTokenFooter;
