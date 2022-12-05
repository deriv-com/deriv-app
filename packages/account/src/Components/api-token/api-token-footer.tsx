import React from 'react';
import { createPortal } from 'react-dom';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ApiTokenContext from './api-token-context';
import { TApiContext } from 'Types';

const ApiTokenFooter = () => {
    const { footer_ref, toggleOverlay } = React.useContext<TApiContext>(ApiTokenContext);

    return createPortal(
        <a className='link link--prominent' onClick={toggleOverlay}>
            <Text size='xxs' line_height='m' weight='bold'>
                <Localize i18n_default_text='Learn more about API token' />
            </Text>
        </a>,
        footer_ref
    );
};

export default ApiTokenFooter;
