import React from 'react';
import classnames from 'classnames';
import { Icon, Button, Loading } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import Dp2pContext from 'Components/context/dp2p-context';
import { TableError } from 'Components/table/table-error.jsx';
import { requestWS } from 'Utils/websocket';
import FormAds from './form-ads.jsx';
import MyAdsTable from './my-ads-table.jsx';
import './my-ads.scss';

const MyAdsState = ({ message, button_text, buttonOnClick }) => (
    <div className='p2p-my-ads__state'>
        <TableError message={message} />
        {button_text && buttonOnClick && (
            <Button
                type='button'
                className='p2p-my-ads__state-button'
                text={button_text}
                onClick={buttonOnClick}
                primary
            />
        )}
    </div>
);

class MyAds extends React.Component {
    // TODO: Find a better solution for handling no-op instead of using is_mounted flags
    is_mounted = false;

    state = {
        is_loading: true,
        show_form: false,
        is_pending: false,
        is_authenticated: false,
        show_popup: false,
    };

    handleShowForm = show_form => {
        this.setState({ show_form });
    };

    componentDidMount() {
        this.is_mounted = true;

        requestWS({ get_account_status: 1 }).then(response => {
            if (this.is_mounted && !response.error) {
                const { get_account_status } = response;
                const { authentication } = get_account_status;
                const { document, identity } = authentication;
                const { status: document_status } = document;
                const { status: identity_status } = identity;

                this.setState({
                    is_pending: document_status === 'pending' || identity_status === 'pending',
                    is_authenticated: document_status === 'verified' || identity_status === 'verified',
                });
            }

            this.setState({ is_loading: false });
        });
    }
    applyAction = () => {
        if (this.context.nickname) {
            // TODO: redirect without refresh
            window.location.href = '/account/proof-of-identity';
        }
    };

    onClickCreate = () => {
        this.setState({ show_form: true });
    };

    render() {
        if (this.state.is_loading) {
            return <Loading is_fullscreen={false} />;
        }

        if (this.context.is_restricted) {
            return <MyAdsState message={localize('P2P cashier is unavailable in your country.')} />;
        }

        if (!this.context.is_advertiser && this.state.is_authenticated && this.context.nickname) {
            return (
                <MyAdsState message={localize('Your P2P cashier has been blocked. Please contact customer support')} />
            );
        }

        if (this.state.is_authenticated && !this.context.nickname) {
            return (
                <MyAdsState
                    message={localize('To get started, you need a nickname.')}
                    button_text={localize('Set nickname')}
                    buttonOnClick={this.toggleNicknamePopup}
                />
            );
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

        return (
            <>
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
                                : localize(
                                      "We'll need you to upload your documents to verify your identity and address."
                                  )}
                        </p>
                    </div>
                    <Button
                        type='button'
                        className='p2p-my-ads__empty-button'
                        text={this.state.is_pending ? localize('Check status') : localize('Apply')}
                        onClick={this.applyAction}
                        primary
                    />
                </div>
            </>
        );
    }
}

export default MyAds;

MyAds.contextType = Dp2pContext;
