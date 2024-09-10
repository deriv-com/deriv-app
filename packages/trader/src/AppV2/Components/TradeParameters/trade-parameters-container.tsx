import React from 'react';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv-com/quill-ui';
import Guide from '../Guide';

type TTradeParametersContainer = {
    is_minimized?: boolean;
    is_minimized_visible?: boolean;
};

const TradeParametersContainer = ({
    children,
    is_minimized,
    is_minimized_visible,
}: React.PropsWithChildren<TTradeParametersContainer>) =>
    is_minimized && is_minimized_visible ? (
        <div className='trade-params--minimized'>{children}</div>
    ) : (
        <section className='trade-params'>
            <div className='trade-params__title'>
                <Text>
                    <Localize i18n_default_text='Set your trade' />
                </Text>
                <Guide has_label show_guide_for_selected_contract />
            </div>
            {children}
        </section>
    );

export default React.memo(TradeParametersContainer);
