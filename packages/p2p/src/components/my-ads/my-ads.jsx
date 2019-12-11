import React, { Component, Fragment } from 'react';
import { Button }                     from 'deriv-components';
import { localize }                   from 'Components/i18next';
import FormAds                        from './form-ads.jsx';
import { MyAdsTable }                 from './my-ads-table.jsx';
import ToggleAds                      from './toggle-ads.jsx';
import './my-ads.scss';

class MyAds extends Component {
    state = {
        ad_id     : '',
        // is_enabled: false,
        show_form : false,
    };

    handleShowForm = (show_form) => {
        this.setState({ show_form });
    };

    render() {
        return (
            <div className='p2p-my-ads'>
                {this.state.show_form ? (
                    <FormAds ad_id={this.state.ad_id} handleShowForm={this.handleShowForm} />
                ) : (
                    <Fragment>
                        <div className='p2p-my-ads__header'>
                            {/* <ToggleAds
                                is_enabled={true}
                            /> */}
                            <Button
                                primary
                                onClick={() => this.handleShowForm(true) }
                            >
                                {localize('Create ad')}
                            </Button>
                        </div>
                        <MyAdsTable />
                    </Fragment>
                )}
            </div>
        );
    }
}

export default MyAds;
