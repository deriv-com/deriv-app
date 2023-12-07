import React from 'react';
import { Analytics } from '@deriv/analytics';
import { Dialog } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import NoSearchResult from './common/no-search-result-found';
import FAQContent from './faq-content';
import GuideContent from './guide-content';
import TutorialsTabDesktop from './tutorials-tab-desktop';
import TutorialsTabMobile from './tutorials-tab-mobile';

const TutorialsTab = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { dashboard } = useDBotStore();
    const [prev_active_tutorials, setPrevActiveTutorialsTab] = React.useState<number | null>(0);

    const {
        active_tab_tutorials,
        video_tab_content,
        guide_tab_content,
        faq_tab_content,
        dialog_options,
        is_dialog_open,
        onCloseDialog: onOkButtonClick,
    } = dashboard;

    React.useEffect(() => {
        Analytics.trackEvent('ce_bot_tutorial_form', {
            action: 'open',
            form_source: 'bot_header_form',
        });
        return () => {
            Analytics.trackEvent('ce_bot_tutorial_form', {
                action: 'close',
                form_source: 'bot_header_form',
            });
        };
    }, []);

    React.useEffect(() => {
        const _active_tab = [0, 1];
        if (_active_tab.includes(active_tab_tutorials)) {
            setPrevActiveTutorialsTab(active_tab_tutorials);
        }
    }, [active_tab_tutorials]);

    const has_content_guide_tab =
        guide_tab_content.length > 0 || video_tab_content.length > 0 || faq_tab_content.length > 0;

    const tutorial_tabs = [
        {
            label: localize('Guide'),
            content: <GuideContent guide_tab_content={guide_tab_content} video_tab_content={video_tab_content} />,
        },
        {
            label: localize('FAQ'),
            content: <FAQContent faq_list={faq_tab_content} />,
        },
        {
            label: localize('Search'),
            content: has_content_guide_tab ? (
                <>
                    <GuideContent guide_tab_content={guide_tab_content} video_tab_content={video_tab_content} />
                    <FAQContent faq_list={faq_tab_content} />
                </>
            ) : (
                <NoSearchResult />
            ),
        },
    ];

    return (
        <>
            <div className='tutorials-wrap'>
                <Dialog
                    title={dialog_options.title}
                    is_visible={is_dialog_open}
                    cancel_button_text={localize('Cancel')}
                    onCancel={onOkButtonClick}
                    confirm_button_text={localize('OK')}
                    onConfirm={onOkButtonClick}
                    is_mobile_full_width
                    className={'dc-dialog'}
                    has_close_icon
                    onClose={onOkButtonClick}
                >
                    <iframe width='100%' height='100%' src={dialog_options.url} frameBorder='0' allowFullScreen />
                </Dialog>
            </div>
            <>
                {is_mobile ? (
                    <TutorialsTabMobile tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
                ) : (
                    <TutorialsTabDesktop tutorial_tabs={tutorial_tabs} prev_active_tutorials={prev_active_tutorials} />
                )}
            </>
        </>
    );
});

export default TutorialsTab;
