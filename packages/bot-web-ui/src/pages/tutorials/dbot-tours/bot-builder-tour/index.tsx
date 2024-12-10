import React from 'react';
import { observer } from 'mobx-react-lite';
import BotBuilderTourDesktop from './bot-builder-tour-desktop';
import BotBuilderTourMobile from './bot-builder-tour-mobile';

type TBotBuilderTourHandler = {
    is_mobile: boolean;
};

const BotBuilderTourHandler: React.FC<TBotBuilderTourHandler> = observer(({ is_mobile }) => {
    return <>{is_mobile ? <BotBuilderTourMobile /> : <BotBuilderTourDesktop />};</>;
});

export default BotBuilderTourHandler;
