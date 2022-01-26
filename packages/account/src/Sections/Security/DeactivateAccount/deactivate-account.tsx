import React, { useState } from 'react';
import DeactivateAccountSteps from './deactivate-account-steps.jsx';
import DeactivateAccountReason from './deactivate-account-reason.jsx';

const DeactivateAccount = () => {
    const [render_deactivate_account_reason, setRenderDeactivateAccountReason] = useState(false);
    const redirectToReasons = () => {
        setRenderDeactivateAccountReason(true);
    };
    const redirectToSteps = () => {
        setRenderDeactivateAccountReason(false);
    };

    return (
        <div className='deactivate-account'>
            {render_deactivate_account_reason ? (
                <DeactivateAccountReason onBackClick={() => redirectToSteps()} />
            ) : (
                <DeactivateAccountSteps redirectToReasons={() => redirectToReasons()} />
            )}
        </div>
    );
};

export default DeactivateAccount;
