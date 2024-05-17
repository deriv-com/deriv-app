import React from 'react';
import { AccountsDerivCtraderIcon, StandaloneCircleCheckFillIcon } from '@deriv/quill-icons';

const SuccessIcon = () => {
    return (
        <div>
            <AccountsDerivCtraderIcon height={128} width={128} />
            <StandaloneCircleCheckFillIcon fill='#4BB4B3' iconSize='xl' />
        </div>
    );
};

export default SuccessIcon;
