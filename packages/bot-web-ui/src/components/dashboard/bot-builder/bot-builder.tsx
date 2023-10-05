import React from 'react';
import classNames from 'classnames';
import { observer } from '@deriv/stores';
import { useDBotStore } from '../../../stores/useDBotStore';
import LoadModal from '../../load-modal';
import SaveModal from '../dashboard-component/load-bot-preview/save-modal';
import BotBuilderTourHandler from '../dbot-tours/bot-builder-tour';
import QuickStrategy from '../quick-strategy';
import WorkspaceWrapper from './workspace-wrapper';

const BotBuilder = observer(() => {
    const { dashboard, app, rudder_stack } = useDBotStore();
    const { active_tab, active_tour, is_preview_on_popup } = dashboard;

    const { onMount, onUnmount } = app;
    const el_ref = React.useRef<HTMLInputElement | null>(null);

    const trackRudderStackForBotBuilder = (param: string) => {
        const { trackActionsWithUserInfo } = rudder_stack;
        const payload = {
            action: param,
            form_source: 'ce_bot_builder_form',
        };
        trackActionsWithUserInfo('ce_bot_builder_form', payload);
    };

    React.useEffect(() => {
        //when the bot builder mounts and unmounts
        if (active_tab === 1) {
            trackRudderStackForBotBuilder('open');
            return () => {
                trackRudderStackForBotBuilder('close');
            };
        }
    }, [active_tab]);

    React.useEffect(() => {
        onMount();
        return () => onUnmount();
    }, []);

    return (
        <>
            <div
                className={classNames('bot-builder', {
                    'bot-builder--active': active_tab === 1 && !is_preview_on_popup,
                    'bot-builder--inactive': is_preview_on_popup,
                    'bot-builder--tour-active': active_tour,
                })}
            >
                {is_preview_on_popup ? null : (
                    <div
                        id='scratch_div'
                        ref={el_ref}
                        style={{
                            width: 'calc(100vw - 3.2rem)',
                            height: 'var(--bot-content-height)',
                        }}
                    >
                        <WorkspaceWrapper />
                    </div>
                )}
            </div>
            {active_tab === 1 && <BotBuilderTourHandler />}
            {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
            <LoadModal />
            <SaveModal />
            <QuickStrategy />
        </>
    );
});

export default BotBuilder;
