import React, { Component, Fragment } from 'react';
import { localize } from 'deriv-translations';
import { Button } from 'deriv-components';
import './my-ads.scss';
import FormAds from './form-ads.jsx';

class MyAds extends Component {
    state = {
        show_form: false,
    }

    render() {
        return (
            <Fragment>
                {this.state.show_form ? (
                    <FormAds />
                ) : (
                    <Fragment>
                        <Button primary onClick={() => this.setState({ show_form: !this.state.show_form })}>{localize('Create ads')}</Button>
                    </Fragment>
                )}
            </Fragment>
        );
    }
}

export default MyAds;
