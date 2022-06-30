import React, { useState } from 'react';
import ClosingAccountSteps from './closing-account-steps.jsx';
import ClosingAccountReason from './closing-account-reason.jsx';

const ClosingAccount = () => {
    const [render_close_account_reason, setRenderCloseAccountReason] = useState(false);
    const redirectToReasons = () => {
        setRenderCloseAccountReason(true);
    };
    const redirectToSteps = () => {
        setRenderCloseAccountReason(false);
    };

    return (
        <div className='closing-account'>
            {render_close_account_reason ? (
                <ClosingAccountReason onBackClick={() => redirectToSteps()} />
            ) : (
                <ClosingAccountSteps redirectToReasons={() => redirectToReasons()} />
            )}
        </div>
    );
};

export default ClosingAccount;
