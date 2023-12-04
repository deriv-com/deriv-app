import React from 'react';
import { observer } from 'mobx-react';

import { isMobile } from '@deriv/shared';

import BotBuilderTourDesktop from './bot-builder-tour-desktop';
import BotBuilderTourMobile from './bot-builder-tour-mobile';

const is_mobile = isMobile();
const BotBuilderTourHandler = observer(() => {
    return <>{is_mobile ? <BotBuilderTourMobile /> : <BotBuilderTourDesktop />};</>;
});

export default BotBuilderTourHandler;
