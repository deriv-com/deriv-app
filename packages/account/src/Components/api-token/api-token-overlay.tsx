import React from 'react';
import { Popup } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import ApiTokenContext from './api-token-context';
import { TApiContext } from 'Types';

const ApiTokenOverlay = () => {
    const { overlay_ref, toggleOverlay } = React.useContext<TApiContext>(ApiTokenContext);

    return (
        <Popup.Overlay
            descriptions={[
                {
                    key: 'api_token_desc_1',
                    component: (
                        <Localize
                            key={0}
                            i18n_default_text="To access our mobile apps and other third-party apps, you'll first need to generate an API token."
                        />
                    ),
                },
            ]}
            done_text={localize('Done')}
            overlay_ref={overlay_ref}
            title={localize('API Token')}
            toggleOverlay={toggleOverlay}
        />
    );
};

export default ApiTokenOverlay;
