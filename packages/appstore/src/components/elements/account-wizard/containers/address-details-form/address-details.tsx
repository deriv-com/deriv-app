import React from 'react';
import { observer } from 'mobx-react-lite';
import { AddressDetails } from '@deriv/account';
import { useStores } from 'Stores';

const AddressDetailsForm: React.FC = props => {
    const { client } = useStores();
    const { states_list, fetchStatesList, residence } = client;

    return (
        <AddressDetails
            {...props}
            is_gb_residence={residence === 'gb'}
            fetchStatesList={fetchStatesList}
            states_list={states_list}
        />
    );
};

export default observer(AddressDetailsForm);
