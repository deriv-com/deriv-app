// import PropTypes        from 'prop-types';
import React            from 'react';
import { WS }           from 'Services';
import { connect }      from 'Stores/connect';
import { Button }       from 'deriv-components';
// import DatePicker       from 'App/Components/Form/DatePicker';
import { Formik }       from 'formik';
import { formatDate }   from 'Utils/Date';
import Loading          from '../../../../templates/app/components/loading.jsx';

const makeSettingsRequest = (settings, residence_list) => {
    let citizen = residence_list.find(location => location.text === settings.tax_residence_text).value
    let tax_residence = residence_list.find(location => location.text === settings.citizen_text).value
    const date_of_birth = formatDate(settings.date_of_birth_human, 'YYYY-MM-DD');

    const disabled_settings = ['email', 'tax_residence_text', 'citizen_text', 'date_of_birth_human'];
    disabled_settings.forEach(setting => delete settings[setting])

    return { ...settings, citizen, tax_residence, date_of_birth };
}

// TODO: localize
// TODO: make dynamic
const InputGroup = ({ children }) => <div className='dt-input-group'>{children}</div>
const DatepickerInput = ({ children }) => <div className='dt-datepicker-input'>{children}</div>
const account_opening_reasons = ['Speculative', 'Income Earning', 'Hedging'];

class PersonalDetailsForm extends React.Component {
    state = { is_loading: true }

    updateSettings = settings => {
        const request = makeSettingsRequest(settings, this.props.residence_list);
        WS.setSettings(request).then(() => {
            // force request to update settings cache since settings have been updated
            WS.getSettings({ forced: true });
        })
    }

    render() {
        const {
            date_of_birth,
            first_name,
            last_name,
            citizen,
            email,
            tax_identification_number,
            tax_residence,
            email_consent,
            is_loading } = this.state;

        if (is_loading || !this.props.residence_list.length) return <Loading />;

        let citizen_text = '';
        let tax_residence_text = '';
        if (this.props.residence_list.length) {
            console.log('citizen', citizen, this.props.residence_list.find(location => location.value === citizen));
            console.log('residence_list', this.props.residence_list);
            // citizen_text = citizen ? this.props.residence_list.find(location => location.value === citizen).text : '';
            // tax_residence_text = this.props.residence_list.find(location => location.value === tax_residence).text;
        }
        const date_of_birth_human = formatDate(date_of_birth)

        return (
            <Formik
                initialValues={{ first_name, last_name, email, tax_identification_number, email_consent, citizen_text, tax_residence_text, date_of_birth_human }}
                onSubmit={ this.updateSettings }
            >
                {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              validateField,
            }) => (
                <form>
                    <h2 style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '20px'}}>Details</h2>
                    {/* <InputGroup>
                        <Input
                            data-lpignore="true"
                            type='text'
                            name='first_name'
                            label='First name'
                            required
                        />
                        <Input
                            data-lpignore="true"
                            type='text'
                            name='last_name'
                            label='Last name'
                            required
                        />
                    </InputGroup>
                    <DatepickerInput>
                        <DatePicker 
                            name="date_of_birth_human"
                            value={values.date_of_birth_human}
                            min_date="1919-01-01"
                            alignment="bottom"
                            onChange={handleChange}
                        />
                    </DatepickerInput>
                    <Autocomplete
                        data-lpignore="true"
                        type='text'
                        name='citizen_text'
                        label='Citizenship'
                        required
                        list_items={ this.props.residence_list }
                    />
                    <Input
                        data-lpignore="true"
                        type='text'
                        name='email'
                        label='Email'
                        required
                        disabled
                    />
                    <h2 style={{fontSize: '16px', fontWeight: 'bold', margin: '20px 0'}}>Tax information</h2>
                    <Autocomplete
                        data-lpignore="true"
                        type='text'
                        name='tax_residence_text'
                        label='Tax residence'
                        required
                        list_items={ this.props.residence_list }
                    />
                    <Input
                        data-lpignore="true"
                        type='text'
                        name='tax_identification_number'
                        label='Tax identification number'
                        required
                    />
                    <h2 style={{fontSize: '16px', fontWeight: 'bold', margin: '20px 0'}}>Email preference</h2>
                    <Checkbox value={values.email_consent} onClick={handleChange} name='email_consent' label='Get updates about Deriv products, services and events.'/> */}
                    <Button type='submit'>Save</Button>
                </form>
            )}
            </Formik>
        )
    }

    componentDidMount() {
        this.props.fetchResidenceList();
        WS.getSettings().then((data) => {
            console.log(data.get_settings);
            this.setState({ ...data.get_settings, is_loading: false });
        });
    }
}
// PersonalDetailsForm.propTypes = {};
export default connect(
    ({ client }) => ({
        residence_list          : client.residence_list,
        fetchResidenceList      : client.fetchResidenceList
    }),
)(PersonalDetailsForm);
