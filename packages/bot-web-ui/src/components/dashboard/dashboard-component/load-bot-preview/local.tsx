import React from 'react';
import classNames from 'classnames';
import { Analytics } from '@deriv/analytics';
import { Dialog, Icon, MobileWrapper, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { DBOT_TABS } from 'Constants/bot-contents';
import { clearInjectionDiv } from 'Constants/load-modal';
import { useDBotStore } from 'Stores/useDBotStore';
import BotPreview from './bot-preview';
import './index.scss';

const LocalComponent = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { load_modal, save_modal, dashboard } = useDBotStore();
    const { handleFileChange, loadFileFromRecent, dashboard_strategies } = load_modal;
    const { onConfirmSave } = save_modal;
    const { setActiveTab, setPreviewOnDialog, has_mobile_preview_loaded, setActiveTabTutorial } = dashboard;

    const file_input_ref = React.useRef<HTMLInputElement | null>(null);
    const [is_file_supported, setIsFileSupported] = React.useState<boolean>(true);
    const el_ref = React.useRef<HTMLInputElement | null>(null);
    const has_dashboard_strategies = !!dashboard_strategies?.length;

    const sendToRudderStackForOpenButton = () => {
        Analytics.trackEvent('ce_bot_dashboard_form', {
            action: 'push_open_button',
            form_source: 'ce_bot_dashboard_form',
        });

        //this is to track from which open button user has come to bot builder tab
        Analytics.trackEvent('ce_bot_builder_form', {
            action: 'open',
            form_source: 'bot_dashboard_form_open',
        });
    };

    const sendToRudderStackForUserGuide = () => {
        Analytics.trackEvent('ce_bot_dashboard_form', {
            action: 'push_user_guide',
            form_source: 'ce_bot_dashboard_form',
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
            {is_file_supported && (
                <div
                    className={classNames('load-strategy__local-preview', {
                        'load-strategy__local-preview--listed': has_dashboard_strategies,
                    })}
                >
                    <div className='load-strategy__recent-preview'>
                        <div
                            className={classNames('load-strategy__title', 'load-strategy__recent-preview-title', {
                                'load-strategy__title--listed': has_dashboard_strategies && is_mobile,
                            })}
                        >
                            {!is_mobile && <Localize i18n_default_text='Preview' />}
                            <div className='tab__dashboard__preview__retrigger'>
                                <button
                                    onClick={() => {
                                        sendToRudderStackForUserGuide();
                                        setActiveTab(DBOT_TABS.TUTORIAL);
                                        setActiveTabTutorial(0);
                                    }}
                                >
                                    <Icon
                                        className='tab__dashboard__preview__retrigger__icon'
                                        icon={'IcDbotUserGuide'}
                                    />
                                    {!is_mobile && (
                                        <Text
                                            size='xs'
                                            line_height='s'
                                            className={'tab__dashboard__preview__retrigger__text'}
                                        >
                                            {localize('User Guide')}
                                        </Text>
                                    )}
                                </button>
                            </div>
                        </div>

                        {!is_mobile && (
                            <>
                                <div className='load-strategy__preview-workspace'>
                                    <BotPreview id_ref={el_ref} type={'local'} />
                                </div>
                                <div className='load-strategy__button-group'>
                                    <input
                                        type='file'
                                        ref={file_input_ref}
                                        accept='.xml'
                                        style={{ display: 'none' }}
                                        onChange={e => {
                                            clearInjectionDiv('component', el_ref);
                                            onConfirmSave();
                                            setIsFileSupported(handleFileChange(e, false));
                                        }}
                                    />
                                    {renderOpenButton()}
                                </div>
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
                            >
                                <BotPreview id_ref={el_ref} type='local' />
                                <div className='load-strategy__button-group'>{renderOpenButton()}</div>
                            </Dialog>
                        </MobileWrapper>
                    </div>
                </div>
            )}
        </div>
    );
});

export default LocalComponent;
