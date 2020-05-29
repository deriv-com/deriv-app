import React from 'react';
import classnames from 'classnames';
import { Icon, Button } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import FormAds from './form-ads.jsx';
import MyAdsTable from './my-ads-table.jsx';
import './my-ads.scss';

class MyAds extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false;

    state = {
        is_enabled: false,
        is_loading: true,
        show_form: false,
        is_pending: false,
        is_authenticated: false,
    };

    handleShowForm = show_form => {
        this.setState({ show_form });
    };

    componentDidMount() {
        this.is_mounted = true;

        if (this.context.is_advertiser) {
            requestWS({ p2p_advertiser_info: 1 }).then(response => {
                if (this.is_mounted && !response.error) {
                    this.setState({ is_enabled: !!response.p2p_advertiser_info.is_listed, is_loading: false });
                }
            });

            requestWS({ get_account_status: 1 }).then(response => {
                const { get_account_status } = response;
                const { authentication } = get_account_status;
                const { document, identity } = authentication;
                const { status: document_status } = document;
                const { status: identity_status } = identity;
                const { status } = authentication;

                this.setState({
                    is_pending: document_status === 'pending' || identity_status === 'pending',
                    is_authenticated: status === 'authenticated',
                });
            });
        }
    }

    onClickCreate = () => {
        this.setState({ show_form: true });
    };

    setEnabled = is_enabled => {
        this.setState({ is_enabled });
    };

    render() {
        if (this.context.is_restricted) {
            return (
                <div className='p2p-my-ads'>
                    <TableError message={localize('P2P cashier is unavailable in your country.')} />;
                </div>
            );
        }
        if (this.context.is_advertiser && this.state.is_authenticated) {
            return (
                <div className='p2p-my-ads'>
                    {this.state.show_form ? (
                        <FormAds handleShowForm={this.handleShowForm} />
                    ) : (
                        <MyAdsTable
                            onClickCreate={this.onClickCreate}
                            is_enabled={this.state.is_enabled}
                            onToggle={this.setEnabled}
                        />
                    )}
                </div>
            );
        }

        return (
            <div
                className={classnames('p2p-cashier__empty', 'p2p-my-ads__empty', {
                    'p2p-my-ads__empty--pending': this.state.is_pending,
                })}
            >
                <Icon icon='IcCashierSendEmail' className='p2p-cashier__empty-icon' size={102} />
                <div className='p2p-cashier__empty-title'>
                    {this.state.is_pending ? localize('Documents received') : localize('Want to post ads?')}
                </div>
                <div className='p2p-cashier__empty-text'>
                    {!this.state.is_pending && (
                        <p>
                            <Localize i18n_default_text='Register with us here.' />
                        </p>
                    )}
                    <p>
                        {this.state.is_pending
                            ? localize("We'll contact you once we have verified the information provided.")
                            : localize("We'll need you to upload your documents to verify your identity and address.")}
                    </p>
                </div>
                <a href='/account/proof-of-identity' className='p2p-cashier__empty-button'>
                    <Button
                        type='button'
                        className='p2p-my-ads__empty-button'
                        text={this.state.is_pending ? localize('Check status') : localize('Apply')}
                        primary
                    />
                </a>
            </div>
        );
    }
}

export default MyAds;

MyAds.contextType = Dp2pContext;
