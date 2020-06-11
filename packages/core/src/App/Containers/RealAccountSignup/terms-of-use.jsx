import { Div100vhContainer, ThemedScrollbars, FormSubmitButton } from '@deriv/components';
import { Field, Formik } from 'formik';
import React from 'react';
import { getDerivComLink } from '@deriv/shared/utils/url';
import { isDesktop, isMobile } from '@deriv/shared/utils/screen';
import CheckboxField from 'App/Containers/RealAccountSignup/checkbox-field.jsx';
import { localize, Localize } from '@deriv/translations';
import { Hr } from './currency-selector.jsx';
import 'Sass/terms-of-use.scss';

const SVGDescription = () => (
    <React.Fragment>
        <h4>
            <Localize i18n_default_text={'Jurisdiction and choice of law'} />
        </h4>
        <p>
            <Localize
                i18n_default_text={
                    'Your account will be opened with Binary (SVG) Ltd., and will be subject to the jurisdiction and laws of Saint Vincent and the Grenadines.'
                }
            />
        </p>
        <Hr />
        <h4>
            <Localize i18n_default_text={'Risk warning'} />
        </h4>
        <p>
            <Localize
                i18n_default_text={
                    'The financial trading services offered on this site are only suitable for customers who accept the possibility of losing all the money they invest and who understand and have experience of the risk involved in the purchase of financial contracts. Transactions in financial contracts carry a high degree of risk. If the contracts you purchased expire as worthless, you will lose all your investment, which includes the contract premium.'
                }
            />
        </p>
        <Hr />
        <h4>
            <Localize i18n_default_text='Real accounts are not available to politically exposed persons (PEPs).' />
        </h4>
        <p>
            <Localize i18n_default_text='A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.' />
        </p>
    </React.Fragment>
);

const IOMDescription = () => (
    <React.Fragment>
        <h4>
            <Localize i18n_default_text={'Jurisdiction and choice of law'} />
        </h4>
        <p>
            <Localize
                i18n_default_text={
                    'Your account will be opened with Binary (IOM) Ltd, and will be subjected to the jurisdiction and laws of Isle of Man.'
                }
            />
        </p>
        <Hr />
        <h4>
            <Localize i18n_default_text='Real accounts are not available to politically exposed persons (PEPs).' />
        </h4>
        <p>
            <Localize i18n_default_text='A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.' />
        </p>
    </React.Fragment>
);

const MaltaDescription = () => (
    <React.Fragment>
        <h4>
            <Localize i18n_default_text={'Jurisdiction and choice of law'} />
        </h4>
        <p>
            <Localize
                i18n_default_text={
                    'Your account will be opened with Binary (Europe) Ltd, and will be subjected to the jurisdiction and laws of Malta Gaming Authority.'
                }
            />
        </p>
        <Hr />
        <h4>
            <Localize i18n_default_text='Real accounts are not available to politically exposed persons (PEPs).' />
        </h4>
        <p>
            <Localize i18n_default_text='A politically exposed person (PEP) is someone appointed with a prominent public position. Close associates and family members of a PEP are also considered to be PEPs.' />
        </p>
    </React.Fragment>
);

class TermsOfUse extends React.Component {
    render() {
        return (
            <Formik
                initialValues={this.props.value}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values.agreed_tos, actions.setSubmitting);
                }}
                render={({
                    handleSubmit,
                    // setFieldValue,
                    // setFieldTouched,
                    values,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <ThemedScrollbars
                            is_native={isMobile()}
                            autohide
                            style={{
                                height: 'calc(100% - 50px)',
                            }}
                        >
                            <Div100vhContainer className='terms-of-use' height_offset='169px' is_disabled={isDesktop()}>
                                {this.props.can_upgrade_to === 'svg' && <SVGDescription />}
                                {this.props.can_upgrade_to === 'iom' && <IOMDescription />}
                                {this.props.can_upgrade_to === 'malta' && <MaltaDescription />}
                                <Field
                                    component={CheckboxField}
                                    className='terms-of-use__checkbox'
                                    name='agreed_tos'
                                    id='agreed_tos'
                                    label={localize('I am not a PEP, and I have not been a PEP in the last 12 months.')}
                                />
                                <Hr />
                                <Field
                                    component={CheckboxField}
                                    className='terms-of-use__checkbox'
                                    name='agreed_tnc'
                                    id='agreed_tnc'
                                    label={
                                        <Localize
                                            i18n_default_text='I have read and agree to the <0>terms and conditions</0> of the Deriv website.'
                                            components={[
                                                <a
                                                    key={0}
                                                    className='link'
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    href={getDerivComLink('/terms-and-conditions')}
                                                />,
                                            ]}
                                        />
                                    }
                                />
                            </Div100vhContainer>
                        </ThemedScrollbars>
                        <FormSubmitButton
                            is_absolute
                            is_disabled={isSubmitting || !values.agreed_tos || !values.agreed_tnc}
                            label={localize('Add account')}
                            has_cancel={true}
                            onCancel={this.props.onCancel}
                            cancel_label={localize('Previous')}
                            form_error={this.props.form_error}
                        />
                    </form>
                )}
            />
        );
    }
}

export default TermsOfUse;
