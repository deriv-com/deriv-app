import { useContext } from 'react';
import clsx from 'clsx';

import { Button, Icon, Popup, Text } from '@deriv/components';
import { Chat } from '@deriv/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { URLUtils } from '@deriv-com/utils';

import SelfExclusionContext from './self-exclusion-context';

type TSelfExclusionArticleItems = Record<'is_eu' | 'is_app_settings', boolean | undefined>;

type TSelfExclusionArticleContent = {
    is_in_overlay: boolean;
};

export const selfExclusionArticleItems = ({ is_eu, is_app_settings }: TSelfExclusionArticleItems) => {
    const getEuItems = () => {
        const eu_items = [
            {
                component: (
                    <Localize
                        i18n_default_text='We’ve introduced these limits to encourage <0>responsible trading</0>. They are optional, and you can adjust them anytime.'
                        components={[
                            <a
                                key={0}
                                className='link'
                                rel='noopener noreferrer'
                                target='_blank'
                                href={URLUtils.getDerivStaticURL('/responsible')}
                            />,
                        ]}
                    />
                ),
            },
            {
                component: (
                    <Localize i18n_default_text='You decide how much and how long to trade. You can take a break from trading whenever you want. This break can be from 6 weeks to 5 years. When it’s over, you can extend it or resume trading after a 24-hour cooling-off period. If you don’t want to set a specific limit, leave the field empty.' />
                ),
            },
            {
                component: (
                    <Localize
                        i18n_default_text='These limits apply to your multipliers trades only. For example, <0>maximum total loss</0> refers to the losses on your multipliers trades.'
                        components={[<strong key={0} />]}
                    />
                ),
            },
        ];

        if (!is_app_settings) {
            eu_items.push({
                component: (
                    <Localize
                        i18n_default_text='If you want to adjust your limits, <0>contact us via live chat</0>. We’ll make the adjustments within 24 hours.'
                        components={[<span className='link link--orange' key={0} onClick={Chat.open} />]}
                    />
                ),
            });
        }

        return eu_items;
    };

    const getNonEuItems = () => [
        {
            component: (
                <Localize
                    i18n_default_text='We’ve introduced these limits to encourage <0>responsible trading</0>. They are optional, and you can adjust them anytime.'
                    components={[
                        <a
                            key={0}
                            className='link'
                            rel='noopener noreferrer'
                            target='_blank'
                            href={URLUtils.getDerivStaticURL('/responsible')}
                        />,
                    ]}
                />
            ),
        },
        {
            component: (
                <Localize i18n_default_text='You decide how much and how long to trade. You can take a break from trading whenever you want. This break can be from 6 weeks to 5 years. When it’s over, you can extend it or log in to resume trading. If you don’t want to set a specific limit, leave the field empty.' />
            ),
        },
        {
            component: (
                <Localize
                    i18n_default_text='These limits apply to your options trades only. For example, <0>maximum total loss</0> refers to the losses on all your trades on options trading platforms.'
                    components={[<strong key={0} />]}
                />
            ),
        },
        ...(!is_app_settings
            ? [
                  {
                      component: (
                          <Localize
                              i18n_default_text='If you want to adjust your self-exclusion limits, <0>contact us via live chat.</0>'
                              components={[<span className='link link--orange' key={0} onClick={Chat.open} />]}
                          />
                      ),
                  },
              ]
            : []),
    ];

    const article_items = is_eu ? getEuItems() : getNonEuItems();
    return article_items.map((article_item, idx) => ({
        ...article_item,
        key: `self_exclusion_desc_${idx}`,
    }));
};

const SelfExclusionArticleContent = ({ is_in_overlay }: Partial<TSelfExclusionArticleContent>) => {
    const { is_app_settings, toggleArticle, overlay_ref, is_eu } = useContext(SelfExclusionContext);
    const { localize } = useTranslations();

    const keyed_article_items = selfExclusionArticleItems({ is_eu, is_app_settings });
    if (is_in_overlay) {
        return (
            <Popup.Overlay
                descriptions={keyed_article_items}
                done_text={localize('Done')}
                overlay_ref={overlay_ref}
                title={localize('Trading limits')}
                toggleOverlay={toggleArticle}
            />
        );
    }

    return (
        <div
            className={clsx('da-self-exclusion-article__content', {
                'da-self-exclusion-article__content--is-in-modal': !is_in_overlay,
            })}
        >
            <div className='da-self-exclusion-article__content-header-container'>
                <Text
                    as='h3'
                    color='prominent'
                    size='s'
                    line_height='l'
                    weight='bold'
                    className='da-self-exclusion-article__content-header'
                >
                    <Localize i18n_default_text='About trading limits and self-exclusion' />
                </Text>
                <Icon icon='IcCross' className='da-self-exclusion-article__content-icon' onClick={toggleArticle} />
            </div>
            <ul className='da-self-exclusion-article__content-list'>
                {keyed_article_items.map(article => (
                    <li key={article.key}>
                        <Text as='span' size='xxs'>
                            {article.component}
                        </Text>
                    </li>
                ))}
            </ul>
            {is_app_settings && (
                <div className='da-self-exclusion-article__content-button'>
                    <Button secondary large onClick={toggleArticle}>
                        <Localize i18n_default_text='Done' />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SelfExclusionArticleContent;
