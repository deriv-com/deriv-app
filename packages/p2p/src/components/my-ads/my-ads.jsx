import React, { Component, Fragment } from 'react';
import { localize }                   from 'deriv-translations';
import { Button }                     from 'deriv-components';
import FormAds                        from './form-ads.jsx';
import ToggleAds                      from './toggle-ads.jsx';
import './my-ads.scss';

class MyAds extends Component {
    state = {
        show_form : false,
        ad_id     : '',
        is_enabled: false,
    }

    handleShowForm = (show_form) => {
        this.setState({ show_form });
    }

    render() {
        return (
            <div className='my-ads'>
                {this.state.show_form ? (
                    <FormAds ad_id={this.state.ad_id} handleShowForm={this.handleShowForm} />
                ) : (
                    <Fragment>
                        <div className="my-ads__header">
                            <ToggleAds
                                is_enabled={true}
                            />
                            <Button
                                primary
                                onClick={() => this.handleShowForm(true) }>{localize('Create ads')}
                            </Button>
                        </div>
                    </Fragment>
                )}
            </div>
        );
    }
}

export default MyAds;
