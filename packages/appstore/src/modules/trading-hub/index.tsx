import * as React from 'react';
import { Button } from '@deriv/ui';
import AppWizard from 'Components/app-wizard';

const TradingHub = () => {
    const [is_app_wizard_open, setIsAppWizardOpen] = React.useState(false);

    return (
        <div className='trading-hub'>
            <Button onClick={() => setIsAppWizardOpen(true)}>Get more Apps</Button>
            {is_app_wizard_open && <AppWizard close={() => setIsAppWizardOpen(false)} />}
        </div>
    );
};

export default TradingHub;
