import React from 'react';
// import { TTradingPlatformAvailableAccount, TIconData } from 'Components/props.types';
// import { getHighlightedIconLabel } from '../../Helpers/compare-accounts-config';

type TCFDAccountsDescriptionProps = {
    // trading_platforms: TTradingPlatformAvailableAccount;
};

const CFDAccountsDescription: React.FC<TCFDAccountsDescriptionProps> = () => {
    // const iconData: TIconData[] = [...getHighlightedIconLabel(trading_platforms)];

    return <div className={'compare-cfd-account-outline'}>Description</div>;
};

export default CFDAccountsDescription;
