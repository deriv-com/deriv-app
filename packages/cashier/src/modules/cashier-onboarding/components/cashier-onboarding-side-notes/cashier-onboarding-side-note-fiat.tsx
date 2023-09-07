import React from 'react';
import { SideNote } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const CashierOnboardingSideNoteFiat: React.FC = observer(() => {
    const { common } = useStore();
    const { is_from_derivgo } = common;

    return (
        <SideNote
            description={
                <Localize
                    i18n_default_text='If you want to change your account currency, please contact us via <0>live chat</0>.'
                    components={[
                        is_from_derivgo ? (
                            <span />
                        ) : (
                            <a key={0} className='link link--orange' onClick={() => window.LC_API.open_chat_window()} />
                        ),
                    ]}
                />
            }
        />
    );
});

export default CashierOnboardingSideNoteFiat;
