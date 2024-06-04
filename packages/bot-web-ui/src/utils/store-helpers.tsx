import React from 'react';
import { Localize } from '@deriv/translations';

export const helpers = {
    keep_current_contract: (
        <Localize
            i18n_default_text='Would you like to keep your current contract or close it? If you decide to keep it running, you can check and close it later on the <0>Reports</0> page.'
            components={[
                <a key={0} className='link' rel='noopener noreferrer' target='_blank' href='/reports/positions' />,
            ]}
        />
    ),
};
