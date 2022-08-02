import * as React from 'react';
import { StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getBrandWebsiteName, getPlatformSettings, PlatformContext, isDesktop, isMobile } from '@deriv/shared';
import AccountArticle from 'Components/article/article.jsx';
import { selfExclusionArticleItems } from 'Components/self-exclusion/self-exclusion-article-content.jsx';
import SelfExclusionContext from './self-exclusion-context';

const SelfExclusionArticle = () => {
    const { is_app_settings, toggleArticle, is_eu, is_uk } = React.useContext(SelfExclusionContext);
    const { is_deriv_crypto } = React.useContext(PlatformContext);
    const { is_appstore } = React.useContext(PlatformContext);
    return (
        <AccountArticle
            title={localize('Trading limits and self-exclusion')}
            descriptions={
                is_appstore && isDesktop()
                    ? selfExclusionArticleItems({ is_eu, is_uk, is_deriv_crypto, is_app_settings })
                    : [
                          is_eu ? (
                              <Localize
                                  i18n_default_text='These trading limits and self-exclusion help you control the amount of money and time you spend on {{brand_website_name}} and exercise <0>responsible trading</0>.'
                                  components={[<StaticUrl key={0} className='link' href='/responsible' />]}
                                  values={{ brand_website_name: getBrandWebsiteName() }}
                              />
                          ) : (
                              <Localize
                                  i18n_default_text='These self-exclusion limits help you control the amount of money and time you spend trading on {{platform_name_trader}}, {{platform_name_dbot}}, {{platform_name_smarttrader}} and {{platform_name_bbot}} on Deriv. The limits you set here will help you exercise <0>responsible trading</0>.'
                                  components={[<StaticUrl key={0} className='link' href='/responsible' />]}
                                  values={{
                                      platform_name_trader: getPlatformSettings('trader').name,
                                      platform_name_dbot: getPlatformSettings('dbot').name,
                                      platform_name_smarttrader: getPlatformSettings('smarttrader').name,
                                      platform_name_bbot: getPlatformSettings('bbot').name,
                                  }}
                              />
                          ),
                      ]
            }
            {...((!is_appstore || isMobile()) && { onClickLearnMore: toggleArticle })}
        />
    );
};

export default SelfExclusionArticle;
