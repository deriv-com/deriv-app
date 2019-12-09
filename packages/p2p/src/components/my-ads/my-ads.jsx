import React, { Component, Fragment } from 'react';
import { Button }                     from 'deriv-components';
import FormAds                        from './form-ads.jsx';
import { MyAdsTable }                 from './my-ads-table.jsx';
import ToggleAds                      from './toggle-ads.jsx';
import { localize }                   from '../i18next';
import './my-ads.scss';

class MyAds extends Component {
    state = {
        ad_id     : '',
        is_enabled: false,
        show_form : false,
    };

    handleShowForm = (show_form) => {
        this.setState({ show_form });
    };

    render() {
        return (
            <div className='my-ads'>
                {this.state.show_form ? (
                    <FormAds ad_id={this.state.ad_id} handleShowForm={this.handleShowForm} />
                ) : (
                    <Fragment>
                        <div className='my-ads__header'>
                            <ToggleAds
                                is_enabled={true}
                            />
                            <Button
                                primary
                                onClick={() => this.handleShowForm(true) }
                            >
                                {localize('Create ads')}
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
