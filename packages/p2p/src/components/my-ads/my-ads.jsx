import React, { Component, Fragment } from 'react';
import { Button } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import FormAds from './form-ads.jsx';
import { MyAdsTable } from './my-ads-table.jsx';
import ToggleAds from './toggle-ads.jsx';
import './my-ads.scss';

class MyAds extends Component {
    state = {
        is_enabled: false,
        is_loading: true,
        show_form: false,
    };

    handleShowForm = show_form => {
        this.setState({ show_form });
    };

    componentDidMount() {
        if (this.context.is_advertiser) {
            requestWS({ p2p_agent_info: 1 }).then(response => {
                if (!response.error) {
                    this.setState({ is_enabled: !!response.p2p_agent_info.is_active, is_loading: false });
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
        return <div className='deriv-p2p__empty'>{localize('Apply to become an advertiser')}</div>;
    }
}

export default MyAds;

MyAds.contextType = Dp2pContext;
