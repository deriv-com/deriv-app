import React from 'react';
import { observer } from 'mobx-react-lite';
import { FinancialDetails } from '@deriv/account';
import { useStores } from 'Stores';

const FinancialDetailsForm: React.FC = props => {
    const { client_store } = useStores();
    const { states_list, fetchStatesList, residence } = client_store;

    return (
        <FinancialDetails
            {...props}
            is_gb_residence={residence === 'gb'}
            fetchStatesList={fetchStatesList}
            states_list={states_list}
        />
    );
};

export default observer(FinancialDetailsForm);
