import React from 'react';
import AddApp from 'Components/add-app';
import { WizardContext } from '../context';

type TAddApp = {
    onSubmit: (app: any) => void;
};

const AddAppStep = ({ onSubmit }: TAddApp) => {
    const context = React.useContext(WizardContext);
    let app_type: string;

    const handleSubmit = (app: any) => {
        context.selected_app = app;
        onSubmit({ app });
    };

    if (context.selected_product === 'Deriv MT5') app_type = 'Deriv MT5';
    else if (context.selected_product === 'Deriv X') app_type = 'Deriv X';
    else app_type = 'Other';

    const app = [
        {
            type: 'Deriv MT5',
            app_type_title: 'Deriv MT5 Apps',
            linked_apps: [
                { app_name: 'Deriv MT5 Synthetics USD', app_icon: 'IcAppstoreMt5Synthetic' },
                { app_name: 'Deriv MT5 Financial USD', app_icon: 'IcAppstoreMt5Financial' },
                { app_name: 'Deriv MT5 Financial STP USD', app_icon: 'IcAppstoreMt5FinancialStp' },
            ],
        },
        {
            type: 'Deriv X',
            app_type_title: 'Deriv X Apps',
            linked_apps: [
                { app_name: 'Deriv X Synthetics USD', app_icon: 'icDxtradeSynthetic' },
                { app_name: 'Deriv X Financial USD', app_icon: 'IcDxtradeFinancial' },
            ],
        },
        {
            type: 'Other',
            app_type_title: 'Deriv Apps',
            linked_apps: [{ app_name: 'Deriv apps', app_icon: 'IcAppstoreDerivApps' }],
        },
    ];

    return (
        <>
            {app.map(
                (item: any) =>
                    item.type === app_type && (
                        <AddApp
                            app={item}
                            handleSubmit={handleSubmit}
                            is_dark_mode_on={false}
                            is_mobile={false}
                            selected_app={context.selected_app}
                        />
                    )
            )}
        </>
    );
};

export default AddAppStep;
