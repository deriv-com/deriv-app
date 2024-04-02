import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './eu-disclaimer.scss';

type TEUDisclaimerProps = {
    is_wallet?: boolean;
    wrapperClassName?: string;
    textClassName?: string;
};
type TDisclaimerLocalizedText = {
    is_wallet?: boolean;
};

const DisclaimerLocalizedText = ({ is_wallet }: TDisclaimerLocalizedText) =>
    is_wallet ? (
        <Localize
            i18n_default_text={
                'CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <0>73% of retail investor accounts lose money when trading CFDs with this provider</0>. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'
            }
            components={[<strong key={0} />]}
        />
    ) : (
        <Localize
            i18n_default_text={
                '<0>EU statutory disclaimer</0>: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. <0>70.1% of retail investor accounts lose money when trading CFDs with this provider</0>. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.'
            }
            components={[<strong key={0} />]}
        />
    );

const EUDisclaimer = observer(({ is_wallet, wrapperClassName, textClassName }: TEUDisclaimerProps) => {
    const {
        ui: { is_mobile },
    } = useStore();

    return (
        <div className={wrapperClassName ?? 'disclaimer'} data-testid='dt_disclaimer_wrapper'>
            <Text
                align='left'
                className={textClassName ?? 'disclaimer-text'}
                size={is_mobile ? 'xxxs' : 'xs'}
                data-testid='dt_disclaimer_text'
            >
                <DisclaimerLocalizedText is_wallet={is_wallet} />
            </Text>
        </div>
    );
});

export default EUDisclaimer;
