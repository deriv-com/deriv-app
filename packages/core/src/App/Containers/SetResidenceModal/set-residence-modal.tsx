import classNames from 'classnames';
import { Formik, Form } from 'formik';
import React from 'react';
import { Button, Dialog, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { website_name } from '@deriv/shared';
import ResidenceForm from './set-residence-form.jsx';
import 'Sass/app/modules/set-residence.scss';

type SetResidenceModalProps = {
    disableApp: () => void;
    enableApp: () => void;
    is_loading: boolean;
    is_visible: boolean;
    onSetResidence: () => void;
    residence_list: unknown;
};

type SetResidenceProps = {
    enableApp: () => void;
    onSetResidence: () => void;
    residence_list: unknown;
    toggleModalVisibility: () => void;
};

// TODO: Move some of these functions to helpers since some of them are shared with AccountSignUpModal
const isResidenceText = (item, values) => item.text.toLowerCase() === values.residence.toLowerCase();

const validateResidence = (values, residence_list) => {
    const errors = {};

    if (!values.residence) {
        errors.residence = true;
    } else {
        const index_of_selection = residence_list.findIndex(item => isResidenceText(item, values));

        if (index_of_selection === -1 || residence_list[index_of_selection].disabled === 'DISABLED') {
            errors.residence = localize('Unfortunately, {{website_name}} is not available in your country.', {
                website_name,
            });
        }
    }

    return errors;
};

const SetResidence = ({ enableApp, onSetResidence, residence_list, toggleModalVisibility }: SetResidenceProps) => {
    const onSetResidenceComplete = error => {
        // TODO: Proper error handling (currently we have no place to put the message)
        if (error) {
            throw Error(error);
        }
        // Handle lower level modal controls due to overriding modal rendering
        toggleModalVisibility(false);
        enableApp();
    };

    const onSetResidencePassthrough = values => {
        const index_of_selection = residence_list.findIndex(item => isResidenceText(item, values));
        const modded_values = { ...values, residence: residence_list[index_of_selection].value };
        onSetResidence(modded_values, onSetResidenceComplete);
    };
    return (
        <div className='set-residence'>
            <Formik
                initialValues={{ residence: '' }}
                validate={values => validateResidence(values, residence_list)}
                onSubmit={onSetResidencePassthrough}
            >
                {({ isSubmitting, errors, values, setFieldValue, touched }) => (
                    <Form>
                        <React.Fragment>
                            <ResidenceForm
                                errors={errors}
                                touched={touched}
                                setFieldValue={setFieldValue}
                                residence_list={residence_list}
                            >
                                <Text as='p' size='xxs' weight='bold' className='set-residence__subtext'>
                                    {localize(
                                        'We need this to make sure our service complies with laws and regulations in your country.'
                                    )}
                                </Text>
                                <Button
                                    className={classNames('set-residence__btn', {
                                        'set-residence__btn--disabled':
                                            !values.residence || errors.residence || isSubmitting,
                                    })}
                                    type='submit'
                                    is_disabled={!values.residence || !!errors.residence || isSubmitting}
                                    text={localize('Set residence')}
                                    primary
                                />
                            </ResidenceForm>
                        </React.Fragment>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

const SetResidenceModal = ({
    enableApp,
    disableApp,
    is_loading,
    is_visible,
    onSetResidence,
    residence_list,
    toggleSetResidenceModal,
}: SetResidenceModalProps) => {
    if (residence_list.length < 1) return null;
    return (
        <Dialog
            is_visible={is_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading || !residence_list.length}
            is_content_centered
        >
            <SetResidence
                onSetResidence={onSetResidence}
                residence_list={residence_list}
                toggleModalVisibility={toggleSetResidenceModal}
                enableApp={enableApp}
            />
        </Dialog>
    );
};

export default connect(({ ui, client }) => ({
    is_visible: ui.is_set_residence_modal_visible,
    toggleSetResidenceModal: ui.toggleSetResidenceModal,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    is_loading: ui.is_loading,
    onSetResidence: client.onSetResidence,
    residence_list: client.residence_list,
}))(SetResidenceModal);
