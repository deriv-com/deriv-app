import React from 'react';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';
import CFDAccountTypeDetails from 'Components/cfd-account-type-details';
import { WizardContext } from '../context';

const AppDescriptionStep = () => {
    const { client } = useStores();
    const { residence } = client;
    const context = React.useContext(WizardContext);
    const should_show_cfd_details = !!context.selected_platform && !!residence && !!context.account_type;
    const should_show_deriv_apps_description = ['Options', 'Multipliers'].includes(context.selected_product);

    return (
        <>
            {should_show_cfd_details && (
                <CFDAccountTypeDetails
                    platform={context.selected_platform}
                    residence={residence}
                    account_type={context.account_type}
                />
            )}
            {should_show_deriv_apps_description && (
                <div>
                    <Text weight='bold' size='xs' as='p' line_height='xl'>
                        <Localize i18n_default_text='Deriv Apps' />
                    </Text>
                    <Text size='xs' color='less-prominent'>
                        <Localize i18n_default_text='Trade CFDs on our Senthetic Indices that simulate real-world market movement.' />
                    </Text>
                </div>
            )}
        </>
    );
};

export default observer(AppDescriptionStep);
