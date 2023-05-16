import React from 'react';
import { Autocomplete, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { observer } from '@deriv/stores';
import { Form, Formik, FormikProps } from 'formik';
import { BlocksFields } from './blocks-components';

const items = [{ text: 'Derived' }, { text: 'Forex' }, { text: 'Stock Indices' }, { text: 'Commodities' }];

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
            onHideDropdownList
        },
    } = useDBotStore();

    console.log('Blocks selected_submarket', selected_submarket,'selected_market', selected_market, 'submarkets_dropdown', submarkets_dropdown, 'markets_dropdown', markets_dropdown);
    
    
    // const [selected, setSelected] = React.useState('');

    React.useEffect(() => {
        loadDataStrategy();
        initial_values
    }, []);

    // const [symbols, setSymbols] = React.useState([]);
    // const [markets, setMarkets] = React.useState([]);
    // const [selected_symbol, setSelectedSymbol] = React.useState("");
    // const [price, setPrice] = React.useState(0);


    

    // let displayed_symbols = symbols.filter(
    //   (s) => s.market_display_name === selected_market
    // );
    // const selected_symbol_object = symbols.find(
    //   (s) => s.symbol === selected_symbol
    // );
    // const displayed_selected_symbol = selected_symbol_object?.display_name;
    // const exchange_is_open = selected_symbol_object?.exchange_is_open;
    // React.useEffect(() => {
    //   api
    //     .send({
    //       active_symbols: "brief",
    //       product_type: "basic",
    //     })
    //     .then((response) => {
    //       setSymbols(response.active_symbols);
    //       setMarkets([
    //         ...new Set(response.active_symbols.map((s) => s.market_display_name)),
    //       ]);
    //     });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    // React.useEffect(() => {
    //   api.forgetAll("ticks").then(() => {
    //     if (exchange_is_open) {
    //       const tick = api.subscribe({ ticks: selected_symbol });
    //       tick.subscribe(({ tick }) => {
    //         setPrice(tick.quote);
    //       });
    //     }
    //   });
    // }, [selected_symbol, exchange_is_open]);
  
    // const handleSelectChange = (new_value, is_symbols_dropdown) => {
    //   if (is_symbols_dropdown) {
    //     const new_symbol = symbols.find(
    //       (s) => new_value === s.display_name
    //     ).symbol;
    //     setSelectedSymbol(new_symbol);
    //   } else {
    //     setSelectedMarket(new_value);
    //     setSelectedSymbol(
    //       symbols.find((s) => s.market_display_name === new_value).symbol
    //     );
    //   }
    // };


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
                        console.log('values', values);
                        
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
                                // onChangeDropdownItem={onChangeDropdownItem}
                                onHideDropdownList={onHideDropdownList}
                                setFieldValue={setFieldValue}
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
