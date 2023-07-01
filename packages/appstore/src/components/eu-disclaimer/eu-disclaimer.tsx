import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './eu-disclaimer.scss';

type TProps = {
    is_wallet?: boolean;
    wrapperClassName?: string;
    textClassName?: string;
};

const EUDisclaimer = observer(({ is_wallet, wrapperClassName, textClassName }: TProps) => {
    const {
        ui: { is_mobile },
    } = useStore();

    const disclaimer_text = is_wallet ? (
        <Localize
            i18n_default_text={
                'CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <0>73% of retail investor accounts lose money when trading CFDs with this provider</0>. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'
            }
            components={[<strong key={0} />]}
        />
    ) : (
        <Localize
            i18n_default_text={
                '<0>EU statutory disclaimer</0>: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <0>73% of retail investor accounts lose money when trading CFDs with this provider</0>. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'
            }
            components={[<strong key={0} />]}
        />
    );

    return (
        <div className={wrapperClassName ?? 'disclaimer'} data-testid='dt_disclaimer_wrapper'>
            <Text
                align='left'
                className={textClassName ?? 'disclaimer-text'}
                size={is_mobile ? 'xxxs' : 'xs'}
                data-testid='dt_disclaimer_text'
            >
                {disclaimer_text}
            </Text>
        </div>
    );
});

export default EUDisclaimer;
