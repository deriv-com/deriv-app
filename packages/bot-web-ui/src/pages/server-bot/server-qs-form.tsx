import { Button, Modal, Text, ThemedScrollbars } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import { FormikWrapper, initial_value } from '../bot-builder/quick-strategy/quick-strategy';
import { Form, Formik } from 'formik';
import React from 'react';
import QuickStrategyForm from '../bot-builder/quick-strategy/form';

const ServerQSForm = ({ add_btn_active, setAddBtnActive }) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const handleSubmit = async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        localStorage?.setItem('server-bot-fields', JSON.stringify(values));
        console.log(JSON.stringify(values, null, 2));
    };
    return (
        <>
            <Modal className='modal--strategy' is_open={add_btn_active} width='50rem'>
                <div className='qs server-bot-container'>
                    <div className='server-bot__title'>
                        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
                            <Localize i18n_default_text='Quick strategy' />
                        </Text>
                        <Button onClick={() => setAddBtnActive(false)}>{localize('x')}</Button>
                    </div>
                    <ThemedScrollbars
                        className='qs__form__container'
                        autohide={false}
                    >
                        <FormikWrapper>
                            <Formik
                                initialValues={initial_value}
                                //   validationSchema={dynamic_schema}
                                onSubmit={handleSubmit}
                                //   validate={values => getErrors(values)}
                                validateOnBlur
                                validateOnChange
                                validateOnMount
                            >
                                <Form>
                                    <div className='qs__body__content__form'>
                                        <QuickStrategyForm />
                                    </div>
                                </Form>
                            </Formik>
                        </FormikWrapper>
                    </ThemedScrollbars>
                    <div className='qs__body__content__footer'>
                        <Button green type="submit"
                            // onClick={createBot}
                        >{localize('+ Create strategy')}</Button>
                        <Button green type="submit">{localize('Create & Run strategy')}</Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ServerQSForm;