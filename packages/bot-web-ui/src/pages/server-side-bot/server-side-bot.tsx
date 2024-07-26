import React from 'react';
import BotList from './bot-list';
import ServerBotContainer from './container';
import './server-side-bot.scss';

const ServerSideBot: React.FC = () => {
    return (
        <ServerBotContainer>
            <BotList />
        </ServerBotContainer>
    );
};

export default ServerSideBot;
