import { useState } from 'react';
import ClosingAccountSteps from './closing-account-steps';
import ClosingAccountReason from './closing-account-reason';

const ClosingAccount = () => {
    const [render_close_account_reason, setRenderCloseAccountReason] = useState(false);
    const redirectToReasons = () => {
        setRenderCloseAccountReason(true);
    };
    const redirectToSteps = () => {
        setRenderCloseAccountReason(false);
    };

    return (
        <div className='closing-account' data-testid='dt_closing_account'>
            {render_close_account_reason ? (
                <ClosingAccountReason redirectToSteps={redirectToSteps} />
            ) : (
                <ClosingAccountSteps redirectToReasons={redirectToReasons} />
            )}
        </div>
    );
};

export default ClosingAccount;
