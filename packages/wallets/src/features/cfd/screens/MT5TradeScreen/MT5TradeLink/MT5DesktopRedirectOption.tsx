import React, { FC, Fragment } from 'react';
import { THooks, TPlatforms } from '../../../../../types';
import { AppToContentMapper, CFD_PLATFORMS } from '../../../constants';
import MT5TradeLink from './MT5TradeLink';
import './MT5TradeLink.scss';

type TMT5DesktopRedirectOptionProps = {
    app?: keyof typeof AppToContentMapper;
    isDemo?: THooks.ActiveWalletAccount['is_virtual'];
    platform?: TPlatforms.All;
    webtraderUrl?: THooks.MT5AccountsList['webtrader_url'];
};

const MT5DesktopRedirectOption: FC<TMT5DesktopRedirectOptionProps> = () => {
    const apps: (keyof typeof AppToContentMapper)[] = ['windows', 'macos', 'linux'];
    return (
        <Fragment>
            {apps.map(app => (
                <MT5TradeLink app={app} key={app} platform={CFD_PLATFORMS.MT5} />
            ))}
        </Fragment>
    );
};

export default MT5DesktopRedirectOption;
