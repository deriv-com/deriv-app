import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import DemoMessage from 'Components/demo-message';
import LoadErrorMessage from 'Components/load-error-message';

class SelfExclusion extends React.Component {
    state = {
        error_message: '',
    };

    // initial_form = {
    //     token_name: '',
    //     read: true,
    //     trade: false,
    //     payments: false,
    //     admin: false,
    //     trading_information: false,
    // };

    // validateFields = (values) => {
    //     const errors = {};

    //     const token_name = values.token_name && values.token_name.trim();

    //     if (!token_name) {
    //         errors.token_name = localize('Please enter a token name.');
    //     } else if (token_name.length < 2 || token_name.length > 32) {
    //         errors.token_name = localize('Length of token name must be between 2 and 32 characters.');
    //     } else if (!/^[A-Za-z0-9\s_]+$/g.test(token_name)) {
    //         errors.token_name = localize('Only letters, numbers, and underscores are allowed.');
    //     }

    //     return errors;
    // };

    // handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    //     const new_token_scopes = Object.keys(values).filter((item) => item !== 'token_name' && values[item]);
    //     if (new_token_scopes.length) {
    //         const request = {
    //             api_token: 1,
    //             new_token: values.token_name,
    //             new_token_scopes,
    //         };

    //         const token_response = await WS.apiToken(request);
    //         if (token_response.error) {
    //             setFieldError('token_name', token_response.error.message);
    //         } else {
    //             this.setState({
    //                 is_success: true,
    //                 api_tokens: ObjectUtils.getPropertyValue(token_response, ['api_token', 'tokens']),
    //             });
    //             setTimeout(() => {
    //                 this.setState({ is_success: false });
    //             }, 500);
    //         }
    //         resetForm();
    //     } else {
    //         setFieldError('token_name', localize('Must choose at least one scope'));
    //     }

    //     setSubmitting(false);
    // };

    // populateTokenResponse = (response) => {
    //     if (response.error) {
    //         this.setState({
    //             is_loading: false,
    //             error_message: ObjectUtils.getPropertyValue(response, ['error', 'message']),
    //         });
    //     } else {
    //         this.setState({
    //             is_loading: false,
    //             api_tokens: ObjectUtils.getPropertyValue(response, ['api_token', 'tokens']),
    //         });
    //     }
    // };

    getSelfExclusion = async () => {
        // TODO: get exclusion get api
        this.setState({ is_loading: false });
    };

    componentDidMount() {
        const { is_virtual } = this.props;
        if (is_virtual) {
            this.setState({ is_loading: false });
        } else {
            this.getApiTokens();
        }
    }

    render() {
        const { error_message } = this.state;
        const { is_virtual, is_switching } = this.props;

        if (is_virtual) return <DemoMessage />;

        if (is_loading || is_switching) return <Loading is_fullscreen={false} className='account___intial-loader' />;

        if (error_message) return <LoadErrorMessage error_message={error_message} />;

        return <section className='self-exclusion'>Hello self exclusion</section>;
    }
}

export default connect(({ client }) => ({
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
}))(SelfExclusion);
