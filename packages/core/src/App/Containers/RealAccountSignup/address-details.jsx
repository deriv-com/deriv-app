import { AddressDetails } from '@deriv/account';
import { connect } from 'Stores/connect';

export default connect(({ client }) => ({
    is_gb_residence: client.residence === 'gb',
    fetchStatesList: client.fetchStatesList,
    states_list: client.states_list,
}))(AddressDetails);
