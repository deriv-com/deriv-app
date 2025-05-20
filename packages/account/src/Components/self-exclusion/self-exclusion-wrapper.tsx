import { ReactNode, useContext } from 'react';
import clsx from 'clsx';
import { Div100vhContainer, ThemedScrollbars, InlineMessage } from '@deriv/components';
import SelfExclusionArticle from './self-exclusion-article';
import SelfExclusionContext from './self-exclusion-context';
import { useDevice } from '@deriv-com/ui';
import { Localize } from '@deriv-com/translations';
import { Chat } from '@deriv/utils';

const SelfExclusionWrapper = ({ children }: { children?: ReactNode }) => {
    const { is_app_settings, is_wrapper_bypassed, state, is_mf } = useContext(SelfExclusionContext);
    const { isDesktop } = useDevice();

    // Check if any exclusion field has a value
    const hasAnyExclusion = is_mf && Object.values(state?.self_exclusions || {}).some(value => value);

    // "is_wrapper_bypassed" is currently used for a <AppSettings> hosted <SelfExclusion>.
    // It only features the <SelfExclusionArticle> for mobile views, as the <AppSettings> footer
    // has a link rather than <SelfExclusionArticle> to view the <SelfExclusionArticleContent>.
    if (is_wrapper_bypassed) {
        return (
            <section
                role='section-self-exclusion-wrapper'
                className={clsx('da-self-exclusion', {
                    'da-self-exclusion--app-settings': is_app_settings,
                })}
            >
                {!isDesktop && <SelfExclusionArticle />}
                {children}
            </section>
        );
    }

    return (
        <Div100vhContainer
            className={clsx('da-self-exclusion__wrapper', {
                'da-self-exclusion__wrapper--show-article': state?.show_article,
            })}
            is_disabled={isDesktop}
            height_offset='80px'
        >
            <div className='da-self-exclusion__inner-wrap'>
                {hasAnyExclusion && (
                    <InlineMessage
                        type='information'
                        size={isDesktop ? 'sm' : 'md'}
                        className='da-self-exclusion__banner'
                        message={
                            <Localize
                                i18n_default_text='To increase or remove your limit, contact us via <0>live chat</0>.'
                                components={[<span key={0} className='link link--prominent' onClick={Chat.open} />]}
                            />
                        }
                    />
                )}
                <ThemedScrollbars className='da-self-exclusion__scrollbars' is_bypassed={!isDesktop}>
                    {!isDesktop && <SelfExclusionArticle />}
                    {children}
                </ThemedScrollbars>
            </div>
            {isDesktop && <SelfExclusionArticle />}
        </Div100vhContainer>
    );
};

export default SelfExclusionWrapper;
