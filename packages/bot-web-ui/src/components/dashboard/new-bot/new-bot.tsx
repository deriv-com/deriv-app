import React from 'react';
import classNames from 'classnames';
import { Button, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Formik, useFormikContext, Form } from 'formik';
import { useStore } from '@deriv/stores';
import { initial_value, FormikWrapper } from '../../quick-strategy/quick-strategy';
import './new-bot.scss';
import QuickStrategyForm from '../../quick-strategy/form';
import RecentComponent from '../dashboard-component/load-bot-preview/recent';

const initial_req_schema = {
    bot_create: 1,
    data: {
        name: "your bot",
        strategy: "martingale",
        parameters: {
            initial_stake: 1,
            size: 2
        },
        contract_parameters: {
            contract_type: "ONETOUCH",
            symbol: "R_100",
            duration: "5",
            duration_unit: "m",
            amount: 1,
            currency: "USD"
        }
    }
};

export default function NewBot() {
    const { client } = useStore();
    // const { submitForm, isValid, setFieldValue, validateForm } = useFormikContext();
    // const { setFieldValue } = useFormikContext();
    React.useEffect(() => {
        const data = JSON.parse(localStorage.getItem('qs-fields') || '{}');
        const parameters = initial_req_schema.data.parameters;
        const contract_parameters = initial_req_schema.data.contract_parameters;

        Object.keys(data).forEach(key => {
            if (key === 'size') {
                parameters[key] = data[key];
            }
            if (key === 'stake') {
                parameters['initial_stake'] = data['stake'];
            }
            if (key === 'type') {
                contract_parameters['contract_type'] = data['type'];
            }
            if (key === 'duration' || key === 'symbol' || key === 'duration_unit' || key === 'amount') {
                contract_parameters[key] = data[key];
            }
            if (key === 'currency') {
                contract_parameters[key] = data[client?.currency];
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        localStorage?.setItem('new-bot-fields', JSON.stringify(values));
        console.log(JSON.stringify(values, null, 2));
    };

    return (
        <div className='qs new-bot'>
            <div className='new-bot-container'>
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
                                    <button type="submit">Submit</button>
                                </div>
                            </Form>
                        </Formik>
                    </FormikWrapper>
                </ThemedScrollbars>
            </div>
            <div>
                <div className='new-bot-btn'>
                    <Button green>{localize('Start')}</Button>
                    <Button primary>{localize('Stop')}</Button>
                    <Button green>{localize('Pause')}</Button>
                    <Button primary>{localize('Remove')}</Button>
                </div>
                <RecentComponent />
            </div>
        </div>
    )
}
