import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDBotStore } from '../../../stores/useDBotStore';
import LoadModal from '../../load-modal';
import QuickStrategy1 from '../../quick-strategy';
import SaveModal from '../dashboard-component/load-bot-preview/save-modal';
import DesktopTours from '../dbot-tours/desktop-tours/desktop-tours';
import MobileTours from '../dbot-tours/mobile-tours/mobile-tours';
import QuickStrategy from '../quick-strategy';
import WorkspaceWrapper from './workspace-wrapper';

const BotBuilder = observer(() => {
    const { dashboard, app } = useDBotStore();
    const { active_tab, has_started_onboarding_tour, has_started_bot_builder_tour, is_preview_on_popup } = dashboard;

    const { onMount, onUnmount } = app;
    const el_ref = React.useRef<HTMLInputElement | null>(null);

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
                    'bot-builder--tour-active': has_started_bot_builder_tour,
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
            {has_started_bot_builder_tour && active_tab === 1 && !has_started_onboarding_tour && (
                <>
                    <MobileWrapper>
                        <MobileTours />
                    </MobileWrapper>
                    <DesktopWrapper>
                        <DesktopTours />
                    </DesktopWrapper>
                </>
            )}
            {/* removed this outside from toolbar becuase it needs to loaded seperately without dependency */}
            <LoadModal />
            <SaveModal />
            <QuickStrategy />
            <QuickStrategy1 />
        </>
    );
});

export default BotBuilder;
