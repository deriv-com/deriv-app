import { Localize } from '@deriv-com/translations';
import { getBrandWebsiteName, getPlatformSettings } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';

const PlatformDescription = observer(() => {
    const {
        traders_hub: { is_eu_user, financial_restricted_countries },
    } = useStore();
    const brand_website_name = getBrandWebsiteName();
    const platform_name_dbot = getPlatformSettings('dbot').name;
    const platform_name_go = getPlatformSettings('go').name;
    const platform_name_smarttrader = getPlatformSettings('smarttrader').name;
    const platform_name_trader = getPlatformSettings('trader').name;
    const platform_name_ctrader = getPlatformSettings('ctrader').name;

    if (is_eu_user) {
        return (
            <Localize
                i18n_default_text={
                    'Use your <0>Deriv password</0> to log in to {{brand_website_name}} and {{platform_name_trader}}.'
                }
                components={[<strong key={0} />]}
                values={{
                    brand_website_name,
                    platform_name_trader,
                }}
            />
        );
    } else if (financial_restricted_countries) {
        return (
            <Localize
                i18n_default_text={
                    'Use your <0>Deriv password</0> to log in to {{brand_website_name}}, {{platform_name_trader}} and {{platform_name_go}}.'
                }
                components={[<strong key={0} />]}
                values={{
                    brand_website_name,
                    platform_name_trader,
                    platform_name_go,
                }}
            />
        );
    }
    return (
        <Localize
            i18n_default_text={
                'Use your <0>Deriv password</0> to log in to {{brand_website_name}}, {{platform_name_go}}, {{platform_name_trader}}, {{platform_name_smarttrader}}, {{platform_name_dbot}} and {{platform_name_ctrader}}.'
            }
            components={[<strong key={0} />]}
            values={{
                brand_website_name,
                platform_name_trader,
                platform_name_dbot,
                platform_name_smarttrader,
                platform_name_go,
                platform_name_ctrader,
            }}
        />
    );
});

export default PlatformDescription;
