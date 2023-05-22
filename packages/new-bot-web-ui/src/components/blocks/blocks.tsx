import React from 'react';
import { Form, Formik, FormikProps } from 'formik';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import { getToken } from 'Services';
import { BlocksFields } from './blocks-components';

const Blocks: React.FC = () => {
    const {
        blocks: {
            initial_values,
            loadDataStrategy,
            markets_dropdown,
            submarkets_dropdown,
            symbols_dropdown,
            trade_type_category_dropdown,
            trade_type_dropdown,
            onHideDropdownList,
            onChangeDropdownItem,
            onScrollStopDropdownList,
            sendStrategy,
        },
        app: { dbot_store },
    } = useDBotStore();

    React.useEffect(() => {
        loadDataStrategy();
    }, []);

    const { token } = getToken();
    const essential_settings = {
        token,
        currency: dbot_store?.client.currency,
    };

    return (
        <div className='bot-builder__wrapper'>
            <div className='bot-builder__container'>
                <Text color='less-prominent'>{localize('1. Trade parameters:')}</Text>
                <Formik
                    initialValues={initial_values}
                    onSubmit={values => sendStrategy(values, essential_settings)}
                    enableReinitialize={true}
                    validateOnMount={true}
                >
                    {({ errors, handleChange, values, isSubmitting, setFieldValue, submitForm }: FormikProps<any>) => {
                        return (
                            <Form className={'bot-builder__form'}>
                                <BlocksFields
                                    markets_dropdown={markets_dropdown}
                                    submarkets_dropdown={submarkets_dropdown}
                                    symbols_dropdown={symbols_dropdown}
                                    trade_type_category_dropdown={trade_type_category_dropdown}
                                    trade_type_dropdown={trade_type_dropdown}
                                    onChangeDropdownItem={onChangeDropdownItem}
                                    onHideDropdownList={onHideDropdownList}
                                    setFieldValue={setFieldValue}
                                    onScrollStopDropdownList={onScrollStopDropdownList}
                                    // handleChange={handleChange}
                                    // onChangeInputValue={onChangeInputValue}
                                    // setCurrentFocus={setCurrentFocus}
                                    values={values}
                                    // errors={errors}
                                />
                                <button type='submit' disabled={isSubmitting}>
                                    Save strategy
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default observer(Blocks);
