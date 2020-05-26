import React from 'react';
import { Icon } from '@deriv/components';
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
        if (this.context.is_advertiser) {
            return (
                <div className='p2p-my-ads'>
                    {this.state.show_form ? (
                        <FormAds handleShowForm={this.handleShowForm} />
                    ) : (
                        <MyAdsTable onClickCreate={this.onClickCreate} is_enabled={this.state.is_enabled} />
                    )}
                </div>
            );
        }
        return (
            <div className='p2p-cashier__empty'>
                <Icon icon='IcCashierSendEmail' className='p2p-cashier__empty-icon' size={102} />
                <div className='p2p-cashier__empty-title'>
                    <Localize i18n_default_text='Want to post ads?' />
                </div>
                <div className='p2p-cashier__empty-contact'>
                    <Localize
                        i18n_default_text='Email <0>{{support_email}}</0>'
                        values={{ support_email: `p2p-support@${this.context.email_domain}` }}
                        components={[
                            <a
                                key={0}
                                className='link'
                                rel='noopener noreferrer'
                                target='_blank'
                                href={`mailto:p2p-support@${this.context.email_domain}`}
                            />,
                        ]}
                    />
                </div>
            </div>
        );
    }
}

export default MyAds;

MyAds.contextType = Dp2pContext;
