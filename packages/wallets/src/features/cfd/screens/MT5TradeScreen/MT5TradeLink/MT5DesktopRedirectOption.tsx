import React, { Fragment } from 'react';
import { CFD_PLATFORMS, getAppToContentMapper } from '../../../constants';
import MT5TradeLink from './MT5TradeLink';
import './MT5TradeLink.scss';

const MT5DesktopRedirectOption = () => {
    const apps: (keyof ReturnType<typeof getAppToContentMapper>)[] = ['web', 'windows', 'macos', 'linux'];
    return (
        <Fragment>
            {apps.map(app => (
                <MT5TradeLink app={app} key={app} platform={CFD_PLATFORMS.MT5} />
            ))}
        </Fragment>
    );
};

export default MT5DesktopRedirectOption;
