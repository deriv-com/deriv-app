import React from 'react';
import { Autocomplete, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';
import { Form, Formik, FormikProps } from 'formik';
import { BlocksFields } from './blocks-components';

const Blocks: React.FC = () => {
    const {
        blocks: { 
            markets_dropdown, 
            loadDataStrategy, 
            exportStrategyToJson, 
            initial_values, 
            submarkets_dropdown,
            onHideDropdownList,
            onChangeDropdownItem,
            symbols_dropdown,
            onScrollStopDropdownList,
        },
    } = useDBotStore();

    React.useEffect(() => {
        loadDataStrategy();
    }, []);

    return (
        <div className='bot-builder__wrapper'>
            <div className='bot-builder__container'>
                <Text color='less-prominent'>{localize('1. Trade parameters:')}</Text>
                <Formik
                    initialValues={initial_values}
                    onSubmit={(values) => {
                        exportStrategyToJson(values);
                        console.log(JSON.stringify(values, null, 2));
                        }
                    }
                    enableReinitialize={true}
                    validateOnMount={true}
                >
                    {({
                        errors,
                        handleChange,
                        values,
                        isSubmitting,
                        setFieldValue,
                        submitForm,
                    }: FormikProps<any>) => {
                        return (
                        <Form
                            className={'bot-builder__form'}
                        >
                            <BlocksFields
                                markets_dropdown={markets_dropdown}
                                submarkets_dropdown={submarkets_dropdown}
                                onChangeDropdownItem={onChangeDropdownItem}
                                onHideDropdownList={onHideDropdownList}
                                setFieldValue={setFieldValue}
                                symbols_dropdown={symbols_dropdown}
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
    )
};

export default observer(Blocks);
