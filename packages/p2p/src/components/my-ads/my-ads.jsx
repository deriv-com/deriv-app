import React, { Component, Fragment } from 'react';
import { Button } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize, Localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import FormAds from './form-ads.jsx';
import { MyAdsTable } from './my-ads-table.jsx';
import ToggleAds from './toggle-ads.jsx';
import './my-ads.scss';

class MyAds extends Component {
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

    render() {
        if (this.context.is_advertiser) {
            return (
                <div className='p2p-my-ads'>
                    {this.state.show_form ? (
                        <FormAds handleShowForm={this.handleShowForm} />
                    ) : (
                        <Fragment>
                            <div className='p2p-my-ads__header'>
                                {!this.state.is_loading && <ToggleAds is_enabled={this.state.is_enabled} />}
                                <Button primary onClick={this.onClickCreate}>
                                    {localize('Create ad')}
                                </Button>
                            </div>
                            <MyAdsTable />
                        </Fragment>
                    )}
                </div>
            );
        }
        return (
            <div className='deriv-p2p__empty'>
                <Localize
                    i18n_default_text='Contact us at <0>{{support_email}}</0> to become an advertiser.'
                    values={{ support_email: `support@${this.context.email_domain}` }}
                    components={[
                        <a
                            key={0}
                            className='link'
                            rel='noopener noreferrer'
                            target='_blank'
                            href={`mailto:support@${this.context.email_domain}`}
                        />,
                    ]}
                />
            </div>
        );
    }
}

export default MyAds;

MyAds.contextType = Dp2pContext;
