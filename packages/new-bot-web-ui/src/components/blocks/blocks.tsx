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
            selected_market, 
            setSelectedMarket, 
            selected_submarket, 
            submarkets_dropdown,
            setSelectedSubmarket,
            onHideDropdownList,
            onChangeDropdownItem,
            selected_symbol,
            setSelectedSymbol,
            symbols_dropdown,
            onScrollStopDropdownList,
        },
    } = useDBotStore();

    // console.log('Blocks selected_submarket', selected_submarket,'selected_market', selected_market, 'submarkets_dropdown', submarkets_dropdown, 'markets_dropdown', markets_dropdown);

    React.useEffect(() => {
        loadDataStrategy();
        initial_values
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
                        // createStrategy
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
                        // console.log('values', values);
                        
                        return (
                        <Form
                            className={'bot-builder__form'}
                        >
                            <BlocksFields
                                selected_market={selected_market}
                                markets_dropdown={markets_dropdown}
                                setSelectedMarket={setSelectedMarket}
                                selected_submarket={selected_submarket}
                                submarkets_dropdown={submarkets_dropdown}
                                setSelectedSubmarket={setSelectedSubmarket}
                                onChangeDropdownItem={onChangeDropdownItem}
                                onHideDropdownList={onHideDropdownList}
                                setFieldValue={setFieldValue}
                                selected_symbol={selected_symbol}
                                setSelectedSymbol={setSelectedSymbol}
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

    // return (
    //     <div className='bot-builder__wrapper'>            
    //         <button type='button' onClick={() => exportStrategyToJson(items)}>
    //             Save strategy
    //         </button>
    //         <div className='bot-builder__container'>
    //             <Text color='less-prominent'>{localize('1. Trade parameters:')}</Text>
    //             <div className='bot-builder__item'>
    //                 <Text>{localize('Market:')}</Text>
    //                 <Autocomplete
    //                     autoComplete='off'
    //                     className='quick-strategy__dropdown quick-strategy__leading'
    //                     type='text'
    //                     label={localize(selected_market || 'Derived')}
    //                     list_items={markets_dropdown}
    //                     onItemSelection={(selected_item) => {
    //                         setSelectedMarket(selected_item.text);
    //                     }}
    //                 />
    //                 <Text>&nbsp;&#9658;&nbsp;</Text>
    //                 {/* &gt; */}
    //                 <Autocomplete
    //                     autoComplete='off'
    //                     className='quick-strategy__dropdown quick-strategy__leading'
    //                     type='text'
    //                     // label={localize(submarkets_dropdown[0]?.text)}
    //                     label={localize(selected_submarket)}
    //                     list_items={submarkets_dropdown}
    //                     onItemSelection={(selected_item) => {
    //                         setSelectedSubmarket(selected_item.text);
    //                     }}
    //                 />
    //                 <Text>&nbsp;&#9658;&nbsp;</Text>
    //                 <Autocomplete
    //                     autoComplete='off'
    //                     className='quick-strategy__dropdown quick-strategy__leading'
    //                     type='text'
    //                     label={localize(selected)}
    //                     list_items={items}
    //                     onItemSelection={({ text }) => {
    //                         setSelected(text);
    //                     }}
    //                 />
    //             </div>
    //             <div className='bot-builder__item'>
    //                 <Text>{localize('Trade type:')}</Text>
    //                 <Autocomplete
    //                     autoComplete='off'
    //                     className='quick-strategy__dropdown quick-strategy__leading'
    //                     type='text'
    //                     label={localize(selected)}
    //                     list_items={items}
    //                     onItemSelection={({ text }) => {
    //                         setSelected(text);
    //                     }}
    //                 />
    //                 <Text>&nbsp;&#9658;&nbsp;</Text>
    //                 {/* &gt; */}
    //                 <Autocomplete
    //                     autoComplete='off'
    //                     className='quick-strategy__dropdown quick-strategy__leading'
    //                     type='text'
    //                     label={localize(selected)}
    //                     list_items={items}
    //                     onItemSelection={({ text }) => {
    //                         setSelected(text);
    //                     }}
    //                 />
    //             </div>
    //             <div className='bot-builder__item'>
    //                 <Text>{localize('Contract type:')}</Text>
    //                 <Autocomplete
    //                     autoComplete='off'
    //                     className='quick-strategy__dropdown quick-strategy__leading'
    //                     type='text'
    //                     label={localize(selected)}
    //                     list_items={items}
    //                     onItemSelection={({ text }) => {
    //                         setSelected(text);
    //                     }}
    //                 />
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default observer(Blocks);
