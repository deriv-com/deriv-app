import React from 'react';
import { localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import FormAds from './form-ads.jsx';
import MyAdsTable from './my-ads-table.jsx';
import Verification from '../verification/verification.jsx';
import './my-ads.scss';

const MyAdsState = ({ message }) => (
    <div className='p2p-my-ads__state'>
        <TableError message={message} />
    </div>
);

class MyAds extends React.Component {
    state = {
        show_form: false,
    };

    handleShowForm = show_form => {
        this.setState({ show_form });
    };

    componentDidMount() {
        this.is_mounted = true;

        if (!this.context.is_advertiser) {
            requestWS({ get_account_status: 1 }).then(response => {
                if (this.is_mounted && !response.error) {
                    const { get_account_status } = response;
                    const { authentication } = get_account_status;
                    const { identity } = authentication;
                    const { status } = identity;

                    this.setState({
                        poi_status: status,
                    });
                }

                this.setState({ is_loading: false });
            });
        } else {
            this.setState({ is_loading: false });
        }
    }

    onClickCreate = () => {
        this.setState({ show_form: true });
    };

    render() {
        if (this.context.is_restricted) {
            return <MyAdsState message={localize('P2P cashier is unavailable in your country.')} />;
        }

        if (this.context.is_advertiser) {
            return (
                <div className='p2p-my-ads'>
                    {this.state.show_form ? (
                        <FormAds handleShowForm={this.handleShowForm} />
                    ) : (
                        <MyAdsTable onClickCreate={this.onClickCreate} />
                    )}
                </div>
            );
        }

        return <Verification />;
    }
}

export default MyAds;

MyAds.contextType = Dp2pContext;
