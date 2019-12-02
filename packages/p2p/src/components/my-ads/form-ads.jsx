import React       from 'react';
import {
    Autocomplete,
    Button,
    Input }        from 'deriv-components';
import { WS }      from '../../utils/websocket'

class FormAds extends Component {
    state = {
        country: '',
        currency: '',
        type: '',
        asset: '',
        fix_price: '',
        amount: '',
        min_transaction: '',
        payment_method: '',
        advertiser_note: '',
        residence_list: [],
    }
    componentDidMount() {
        if (this.props.id) {
            // call the api, get the file based on id
            // populate the state from the respnose
        }

        WS().send({ 'residence_list': 1 }).then((response) => {
            this.setState({ residence_list: response.residence_list })
        })
    }
    render() { 
        return <div>
            <span>Go back</span>
            <form>
                <div>
                <Autocomplete
                    data-lpignore='true'
                    autoComplete='off'
                    type='text'
                    label={localize('Country')}
                    required
                    list_items={this.state.residence_list}
                />
                </div>
            </form>
        </div>;
    }
}
 
export default FormAds;