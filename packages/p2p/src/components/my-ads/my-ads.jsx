import React, { Component, Fragment } from 'react';
import { localize } from 'deriv-translations';
import { Button } from 'deriv-components';
import './my-ads.scss';
import FormAds from './form-ads.jsx';

class MyAds extends Component {
    state = {
        show_form: false,
        ad_id    : '',
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
                        <Button primary onClick={() => this.handleShowForm(true) }>{localize('Create ads')}</Button>
                    </Fragment>
                )}
            </div>
        );
    }
}

export default MyAds;
