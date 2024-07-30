import React from 'react';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import AddBot from './add-bot';
import BotList from './bot-list';
import ServerBotContainer from './container';
import PerformancePanel from './performance-panel';
import './server-side-bot.scss';

const ServerSideBot: React.FC = observer(() => {
    const [is_open, setFormVisibility] = React.useState(false);
    const { server_bot } = useDBotStore();
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { active_bot_id, setActiveBotId } = server_bot;

    return (
        <>
            <ServerBotContainer>
                <>
                    <MobileWrapper>
                        <BotList setFormVisibility={setFormVisibility} />
                    </MobileWrapper>
                    <DesktopWrapper>
                        <div className='ssb-desktop-wrapper'>
                            <div className='ssb-desktop-wrapper__list'>
                                <BotList setFormVisibility={setFormVisibility} />
                            </div>
                            <div className='ssb-desktop-wrapper__performance-panel'>
                                <PerformancePanel />
                            </div>
                        </div>
                    </DesktopWrapper>
                </>
            </ServerBotContainer>
            <AddBot is_open={is_open} setFormVisibility={setFormVisibility} />
            <MobileFullPageModal
                is_modal_open={is_mobile && !!active_bot_id}
                className='load-strategy__wrapper'
                header={'Some Text'}
                onClickClose={() => {
                    setActiveBotId('');
                }}
                height_offset='80px'
            >
                <div className='ssb-mobile-wrapper'>
                    <PerformancePanel />
                </div>
            </MobileFullPageModal>
        </>
    );
});

export default ServerSideBot;
