import React, { Fragment } from 'react';
import { THooks } from '../../../../../types';
import { CFD_PLATFORMS, getAppToContentMapper } from '../../../constants';
import MT5TradeLink from './MT5TradeLink';
import './MT5TradeLink.scss';

type TMT5DesktopRedirectOptionProps = {
    mt5TradeAccount: THooks.MT5AccountsList;
};

const MT5DesktopRedirectOption: React.FC<TMT5DesktopRedirectOptionProps> = ({ mt5TradeAccount }) => {
    const apps: (keyof ReturnType<typeof getAppToContentMapper>)[] = ['web', 'windows', 'macos', 'linux'];
    return (
        <Fragment>
            {apps.map(app => (
                <MT5TradeLink app={app} key={app} mt5TradeAccount={mt5TradeAccount} platform={CFD_PLATFORMS.MT5} />
            ))}
        </Fragment>
    );
};

export default MT5DesktopRedirectOption;
