import React from 'react';
import classNames from 'classnames';
import { Dialog, MobileWrapper } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';
import { rudderstackDashboardOpenButton } from '../analytics/rudderstack-dashboard';
import BotPreview from './bot-preview';
import './index.scss';

const LocalComponent = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { load_modal, dashboard } = useDBotStore();
    const { loadFileFromRecent, dashboard_strategies } = load_modal;
    const { setActiveTab, setPreviewOnDialog, has_mobile_preview_loaded } = dashboard;

    const el_ref = React.useRef<HTMLInputElement | null>(null);
    const has_strategies = !!dashboard_strategies?.length;

    const sendToRudderStackForOpenButton = () => {
        //this is to track from which open button user has come to bot builder tab
        Analytics.trackEvent('ce_bot_builder_form', {
            action: 'open',
            form_source: 'bot_dashboard_form_open',
        });
    };

    React.useEffect(() => {
        if (el_ref.current?.children.length === 3) {
            el_ref?.current?.removeChild(el_ref?.current?.children[1]);
        }
    }, [el_ref.current?.children.length]);

    const renderOpenButton = () => (
        <button
            className='load-strategy__button-group--open'
            onClick={() => {
                rudderstackDashboardOpenButton();
                sendToRudderStackForOpenButton();
                setPreviewOnDialog(false);
                loadFileFromRecent();
                setActiveTab(DBOT_TABS.BOT_BUILDER);
            }}
        >
            {localize('Open')}
        </button>
    );
    return (
        <div className='load-strategy__container load-strategy__container--has-footer'>
            <div
                className={classNames('load-strategy__local-preview', {
                    'load-strategy__local-preview--listed': has_strategies,
                })}
            >
                <div className='load-strategy__recent-preview'>
                    <div
                        className={classNames('load-strategy__title', 'load-strategy__recent-preview-title', {
                            'load-strategy__title--listed': has_strategies && is_mobile,
                        })}
                    >
                        {!is_mobile && <Localize i18n_default_text='Preview' />}
                    </div>

                    {!is_mobile && (
                        <>
                            <div className='load-strategy__preview-workspace'>
                                <BotPreview id_ref={el_ref} />
                            </div>
                            <div className='load-strategy__button-group'>{renderOpenButton()}</div>
                        </>
                    )}
                    <MobileWrapper>
                        <Dialog
                            is_visible={has_mobile_preview_loaded}
                            onCancel={() => setPreviewOnDialog(false)}
                            is_mobile_full_width
                            className='dc-dialog__wrapper--preview'
                            has_close_icon
                            title={localize('Preview')}
                            onConfirm={() => null}
                        >
                            <BotPreview id_ref={el_ref} />
                            <div className='load-strategy__button-group'>{renderOpenButton()}</div>
                        </Dialog>
                    </MobileWrapper>
                </div>
            </div>
        </div>
    );
});

export default LocalComponent;
