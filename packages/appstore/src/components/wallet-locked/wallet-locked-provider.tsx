import React from 'react';
import { Localize } from '@deriv/translations';

type TProps = {
    is_crypto: boolean;
    is_system_maintenance: boolean;
    wallet_name: string;
};

type getMessageReturnType = {
    description?: React.ReactNode;
    title?: React.ReactNode;
    type?: 'warning' | 'information' | 'success' | 'error';
};

const getMessage = ({ is_crypto, is_system_maintenance, wallet_name }: TProps): getMessageReturnType => {
    if (true) {
        if (true)
            return {
                title: (
                    <Localize
                        i18n_default_text='{{wallet_name}} deposits are temporarily unavailable'
                        values={{ wallet_name }}
                    />
                ),
                description: (
                    <Localize
                        i18n_default_text='Due to system maintenance, deposits into your {{wallet_name}} are unavailable at the moment.<0/>Please try again later.'
                        components={[<br key={0} />]}
                        values={{ wallet_name }}
                    />
                ),
                type: 'warning',
            };
    }

    return null;
};

export default getMessage;
