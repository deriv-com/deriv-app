import React, { Component, Fragment } from 'react';
import PropTypes                 from 'prop-types';
import { localize }              from 'deriv-translations';
import { Formik, Field, Form }   from 'formik';
import { Autocomplete, Loading } from 'deriv-components';
import { WS }                    from '../../utils/websocket';
import IconBack                  from '../../assets/icon-back.jsx';

class FormAds extends Component {
    state = {
        initial_values: {
            country        : '',
            currency       : '',
            type           : '',
            asset          : '',
            fix_price      : '',
            amount         : '',
            min_transaction: '',
            payment_method : '',
            advertiser_note: '',
        },
        residence_list: [],
        is_loading    : true,
    }

    componentDidMount() {
        WS().send({ 'residence_list': 1 }).then((response) => {
            this.setState({ residence_list: response.residence_list });

            if (this.props.id) {
                // call the api, get the file based on id
                // populate the state from the respnose
            } else {
                this.setState({ is_loading: false });
            }
    
        });
    }

    render() {
        return <Fragment>
            <div className='my-ads__heading--wrapper'>
                <div className='my-ads__heading--btn'>
                    <IconBack />
                </div>
            </div>
            {this.state.is_loading ? <Loading is_fullscreen={false} /> : (
                <Formik initialValues={{...this.state.initial_values}}>
                    {({
                        values,
                    // errors,
                    // status,
                    // touched,
                    // handleChange,
                    // handleBlur,
                    // handleSubmit,
                    // isSubmitting,
                    setFieldValue,
                    }) => (
                        <Form>
                            <Field name='country'>
                                {({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        data-lpignore='true'
                                        autoComplete='off'
                                        type='text'
                                        label={localize('Country')}
                                        required
                                        list_items={this.state.residence_list}
                                        onItemSelection={
                                            ({ value, text }) => setFieldValue('country', value ? text : '', true)
                                        }
                                    />
                                )}
                            </Field>
                        </Form>
                    )}

                </Formik>
            )}
        </Fragment>;
    }
}

FormAds.propTypes = {
    id: PropTypes.string,
};
 
export default FormAds;
