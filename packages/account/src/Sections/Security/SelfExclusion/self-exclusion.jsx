import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import DemoMessage from 'Components/demo-message';
import LoadErrorMessage from 'Components/load-error-message';

class SelfExclusion extends React.Component {
    state = {
        is_loading: true,
        is_success: false,
        error_message: '',
        submit_error_message: '',
        self_exclusions: this.exclusion_data,
    };

    exclusion_data = {
        max_turnover: null,
        max_losses: null,
        max_7day_turnover: null,
        max_7day_losses: null,
        max_30day_turnover: null,
        max_30day_losses: null,
        session_duration_limit: null,
        timeout_until: null,
        exclude_until: null,
        max_balance: null,
        max_open_bets: null,
    };

    validateFields = (values) => {
        const errors = {};
        // Regex
        const is_number = /^\d+(\.\d+)?$/;
        const is_integer = /^\d+$/;
        const is_minutes = /^[0-9]|99999/;

        // Messages
        const valid_number_message = localize('Should be a valid number');

        const only_numbers = [
            'max_turnover',
            'max_losses',
            'max_7day_turnover',
            'max_7day_losses',
            'max_30day_turnover',
            'max_30day_losses',
            'max_balance',
        ];
        const only_integers = ['session_duration_limit', 'max_open_bets'];

        only_numbers.forEach((item) => {
            if (!is_number.test(values[item])) {
                errors[item] = valid_number_message;
            }
        });

        only_integers.forEach((item) => {
            if (!is_integer.test(values[item])) {
                errors[item] = valid_number_message;
            }
        });

        if (!is_minutes.test(values.session_duration_limit)) {
            errors.session_duration_limit = localize('Reached maximum amount of session duration limit.');
        }

        // TODO: handle timout until and exclude until using date/moment format

        return errors;
    };

    handleSubmit = async (values, { setSubmitting }) => {
        const is_changed = JSON.stringify(this.state.self_exclusions) !== JSON.stringify(values);
        if (is_changed) {
            const request = {
                set_self_exclusion: 1,
                ...values,
            };

            const set_self_exclusion_response = await WS.authorized.setSelfExclusion(request);
            if (set_self_exclusion_response.error) {
                this.setState({ submit_error_message: set_self_exclusion_response.error.message });
            } else {
                this.setState({
                    is_success: true,
                });
                setTimeout(() => {
                    this.setState({ is_success: false });
                }, 500);
            }
        } else {
            this.setState({ submit_error_message: localize('You did not change anything.') });
        }

        setSubmitting(false);
    };

    populateExclusionResponse = (response) => {
        if (response.error) {
            this.setState({
                is_loading: false,
                error_message: ObjectUtils.getPropertyValue(response, ['error', 'message']),
            });
        } else {
            this.setState({
                is_loading: false,
                self_exclusions: ObjectUtils.getPropertyValue(response, ['self_exclusions', 'tokens']),
            });
        }
    };

    getSelfExclusion = async () => {
        this.setState({ is_loading: true });
        const get_self_exclusion_response = await WS.authorized.getSelfExclusion({ get_self_exclusion: 1 });
        populateExclusionResponse(get_self_exclusion_response);
    };

    componentDidMount() {
        const { is_virtual } = this.props;
        if (is_virtual) {
            this.setState({ is_loading: false });
        } else {
            this.populateExclusionResponse();
        }
    }

    render() {
        const { error_message, is_loading } = this.state;
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
