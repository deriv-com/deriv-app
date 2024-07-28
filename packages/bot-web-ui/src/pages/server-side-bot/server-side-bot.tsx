import React from 'react';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import AddBot from './add-bot';
import BotList from './bot-list';
import ServerBotContainer from './container';
import PerformancePanel from './performance-panel';
import './server-side-bot.scss';

const ServerSideBot: React.FC = () => {
    const [is_open, setFormVisibility] = React.useState(false);

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
        </>
    );
};

export default ServerSideBot;
