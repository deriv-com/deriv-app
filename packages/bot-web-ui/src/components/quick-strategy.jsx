import React              from 'react';
import PropTypes          from 'prop-types';
import {
    Autocomplete,
    Button,
    Icon,
    Input,
    Modal,
    Popover,
    Tabs }                from '@deriv/components';
import { localize }       from '@deriv/translations';
import {
    Formik,
    Form,
    Field,
}                         from 'formik';
import { config }         from '@deriv/bot-skeleton';
import IconTradeType      from './icon-trade-types.jsx';
import { popover_zindex } from '../constants/z-indexes';
import { connect }        from '../stores/connect';
import                         '../assets/sass/quick-strategy.scss';

const QuickStrategyForm = ({
    active_index,
    createStrategy,
    duration_unit_dropdown,
    getSizeDesc,
    getSizeText,
    initial_errors,
    initial_values,
    is_stop_button_visible,
    onChangeDropdownItem,
    onChangeInputValue,
    onHideDropdownList,
    symbol_dropdown,
    trade_type_dropdown,
    validateQuickStrategy,
}) => (
    <div className='quick-strategy__form'>
        <Formik
            initialValues={initial_values}
            validate={validateQuickStrategy}
            onSubmit={createStrategy}
            enableReinitialize={true}
        >
            { ({
                errors,
                handleChange,
                values,
                isSubmitting,
                setFieldValue,
                touched,
                submitForm,
            }) => {
                // Check values in favour of isValid, this is a hack to persist validation through tab switching.
                const validation_errors = validateQuickStrategy(values);
                const is_valid          = Object.keys(validation_errors).length === 0;
                const is_submit_enabled = !isSubmitting && is_valid;

                return (
                    <Form>
                        <div className='quick-strategy__form-row'>
                            <Field name='quick-strategy__symbol'>
                                {({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        autoComplete='off'
                                        className='quick-strategy__dropdown'
                                        type='text'
                                        label={localize('Asset')}
                                        list_items={symbol_dropdown}
                                        onHideDropdownList={() => {
                                            onHideDropdownList('symbol', values[field.name], setFieldValue);
                                        }}
                                        onItemSelection={({ value }) => {
                                            onChangeDropdownItem('symbol', value, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className='quick-strategy__form-row'>
                            <Field name='quick-strategy__trade-type'>
                                {({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        autoComplete='off'
                                        className='quick-strategy__dropdown'
                                        type='text'
                                        label={localize('Trade type')}
                                        list_items={trade_type_dropdown}
                                        onHideDropdownList={() => {
                                            onHideDropdownList('trade-type', values[field.name], setFieldValue);
                                        }}
                                        onItemSelection={({ value }) => {
                                            onChangeDropdownItem('trade-type', value, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                        </div>
                        <div className='quick-strategy__form-row quick-strategy__form-row--multiple'>
                            <Field name='quick-strategy__duration-unit'>
                                {({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        autoComplete='off'
                                        className='quick-strategy__duration-dropdown'
                                        type='text'
                                        label={localize('Duration unit')}
                                        list_items={duration_unit_dropdown}
                                        onHideDropdownList={() => {
                                            onHideDropdownList('duration-unit', values[field.name], setFieldValue);
                                        }}
                                        onItemSelection={({ value }) => {
                                            onChangeDropdownItem('duration-unit', value, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name='quick-strategy__duration-value'>
                                {({ field }) =>  (
                                    <Input
                                        {...field}
                                        className='quick-strategy__input'
                                        type='text'
                                        error={
                                            initial_errors[field.name] || (touched[field.name] && errors[field.name])
                                        }
                                        label={localize('Duration value')}
                                        onChange={(e) => {
                                            handleChange(e);
                                            onChangeInputValue('input_duration_value', e);
                                        }}
                                        placeholder='5'
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={localize('The trade length of your purchased contract.')}
                                                zIndex={popover_zindex.QUICK_STRATEGY}
                                            >
                                                <Icon icon='IcInfoOutline' />
                                            </Popover>
                                        }
                                    />
                                )}
                            </Field>
                        </div>
                        <div className='quick-strategy__form-row quick-strategy__form-row--multiple'>
                            <Field name='quick-strategy__stake'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className='quick-strategy__input'
                                        type='text'
                                        error={
                                            initial_errors[field.name] || (touched[field.name] && errors[field.name])
                                        }
                                        label={localize('Initial stake')}
                                        onChange={(e) => {
                                            handleChange(e);
                                            onChangeInputValue('input_stake', e);
                                        }}
                                        placeholder='10'
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={localize('The amount that you pay to enter a trade.')}
                                                zIndex={popover_zindex.QUICK_STRATEGY}
                                            >
                                                <Icon icon='IcInfoOutline' />
                                            </Popover>
                                        }
                                    />
                                )}
                            </Field>
                            <Field name='quick-strategy__loss'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className='quick-strategy__input'
                                        type='text'
                                        error={
                                            initial_errors[field.name] || (touched[field.name] && errors[field.name])
                                        }
                                        label={localize('Loss threshold')}
                                        onChange={(e) => {
                                            handleChange(e);
                                            onChangeInputValue('input_loss', e);
                                        }}
                                        placeholder='5000'
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={localize('The bot will stop trading if your total loss exceeds this amount.')}
                                                zIndex={popover_zindex.QUICK_STRATEGY}
                                            >
                                                <Icon icon='IcInfoOutline' />
                                            </Popover>
                                        }
                                    />
                                )}
                            </Field>
                        </div>
                        <div className='quick-strategy__form-row quick-strategy__form-row--multiple'>
                            <Field name='quick-strategy__size'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className='quick-strategy__input'
                                        type='text'
                                        error={
                                            initial_errors[field.name] || (touched[field.name] && errors[field.name])
                                        }
                                        label={getSizeText(active_index)}
                                        onChange={(e) => {
                                            handleChange(e);
                                            onChangeInputValue('input_size', e);
                                        }}
                                        placeholder='2'
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={getSizeDesc(active_index)}
                                                zIndex={popover_zindex.QUICK_STRATEGY}
                                            >
                                                <Icon icon='IcInfoOutline' />
                                            </Popover>
                                        }
                                    />
                                )}
                            </Field>
                            <Field name='quick-strategy__profit'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className='quick-strategy__input'
                                        type='text'
                                        error={
                                            initial_errors[field.name] || (touched[field.name] && errors[field.name])
                                        }
                                        label={localize('Profit threshold')}
                                        onChange={(e) => {
                                            handleChange(e);
                                            onChangeInputValue('input_profit', e);
                                        }}
                                        placeholder='5000'
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={localize('The bot will stop trading if your total profit exceeds this amount.')}
                                                zIndex={popover_zindex.QUICK_STRATEGY}
                                            >
                                                <Icon icon='IcInfoOutline' />
                                            </Popover>
                                        }
                                    />
                                )}
                            </Field>
                        </div>
                        <div className='quick-strategy__form-footer'>
                            <Button.Group>
                                <Button
                                    id='quick-strategy__button-edit'
                                    text={localize('Create & Edit')}
                                    is_disabled={!is_submit_enabled}
                                    secondary
                                    large
                                    onClick={() => {
                                        setFieldValue('button', 'edit');
                                        submitForm();
                                    }}
                                />
                                <Button
                                    id='quick-strategy__button-run'
                                    text={localize('Run')}
                                    is_disabled={!is_submit_enabled || is_stop_button_visible}
                                    primary
                                    large
                                    onClick={() => {
                                        setFieldValue('button', 'run');
                                        submitForm();
                                    }}
                                />
                            </Button.Group>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    </div>
);

const MarketOption = ({ symbol }) => (
    <div key={symbol.value} className='quick-strategy__option'>
        <Icon icon={`IcUnderlying${symbol.value}`} size={32} />
        <span className='quick-strategy__symbol'>{symbol.text}</span>
    </div>
);

const TradeTypeOption = ({ trade_type }) => (
    <div key={trade_type.value} className='quick-strategy__option'>
        <IconTradeType type={trade_type.icon[0]} className='quick-strategy__icon' />
        <IconTradeType type={trade_type.icon[1]} className='quick-strategy__icon' />
        <span className='quick-strategy__symbol'>{trade_type.text}</span>
    </div>
);

const QuickStrategy = (props) => {
    const { strategies } = config;
    const {
        is_strategy_modal_open,
        setActiveTabIndex,
        active_index,
        createStrategy,
        duration_unit_dropdown,
        getSizeDesc,
        getSizeText,
        initial_errors,
        initial_values,
        is_stop_button_visible,
        onChangeDropdownItem,
        onChangeInputValue,
        onHideDropdownList,
        validateQuickStrategy,
        symbol_dropdown,
        trade_type_dropdown,
        toggleStrategyModal,
    } = props;

    const symbol_dropdown_options = symbol_dropdown.map(symbol => ({
        component: <MarketOption symbol={symbol} />,
        ...symbol,
    }));

    const trade_type_dropdown_options = trade_type_dropdown.map(trade_type => ({
        component: <TradeTypeOption trade_type={trade_type} />,
        ...trade_type,
    }));

    return (
        <Modal
            title={localize('Quick strategy')}
            className='modal--strategy'
            is_open={is_strategy_modal_open}
            toggleModal={toggleStrategyModal}
            width={'460px'}
        >
            <div className='modal__content'>
                <div className='quick-strategy__tabs'>
                    <Tabs
                        active_index={active_index}
                        onTabItemClick={setActiveTabIndex}
                        top
                    >
                        {
                            Object.keys(strategies).map(key => {
                                const { index, label, description } = strategies[key];
                                return (
                                    <div key={index} label={label}>
                                        <div className='quick-strategy__tab-content'>
                                            <div className='quick-strategy__description'>{description}</div>
                                            <QuickStrategyForm
                                                active_index={active_index}
                                                createStrategy={createStrategy}
                                                duration_unit_dropdown={duration_unit_dropdown}
                                                getSizeDesc={getSizeDesc}
                                                getSizeText={getSizeText}
                                                initial_errors={initial_errors}
                                                initial_values={initial_values}
                                                is_stop_button_visible={is_stop_button_visible}
                                                onChangeDropdownItem={onChangeDropdownItem}
                                                onChangeInputValue={onChangeInputValue}
                                                onHideDropdownList={onHideDropdownList}
                                                validateQuickStrategy={validateQuickStrategy}
                                                symbol_dropdown={symbol_dropdown_options}
                                                trade_type_dropdown={trade_type_dropdown_options}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </Tabs>
                </div>
            </div>
        </Modal>
    );
};

QuickStrategy.propTypes = {
    active_index          : PropTypes.number,
    createStrategy        : PropTypes.func,
    duration_unit_dropdown: PropTypes.array,
    getSizeDesc           : PropTypes.func,
    getSizeText           : PropTypes.func,
    initial_errors        : PropTypes.object,
    initial_values        : PropTypes.object,
    is_stop_button_visible: PropTypes.bool,
    is_strategy_modal_open: PropTypes.bool,
    onChangeDropdownItem  : PropTypes.func,
    onChangeInputValue    : PropTypes.func,
    onChangeSymbolInput   : PropTypes.func,
    onHideDropdownList    : PropTypes.func,
    setActiveTabIndex     : PropTypes.func,
    symbol_dropdown       : PropTypes.array,
    toggleStrategyModal   : PropTypes.func,
    trade_type_dropdown   : PropTypes.array,
    validateQuickStrategy : PropTypes.func,
};

export default connect(({ run_panel, quick_strategy }) => ({
    active_index          : quick_strategy.active_index,
    createStrategy        : quick_strategy.createStrategy,
    duration_unit_dropdown: quick_strategy.duration_unit_dropdown,
    getSizeDesc           : quick_strategy.getSizeDesc,
    getSizeText           : quick_strategy.getSizeText,
    initial_errors        : quick_strategy.initial_errors,
    initial_values        : quick_strategy.initial_values,
    is_stop_button_visible: run_panel.is_stop_button_visible,
    is_strategy_modal_open: quick_strategy.is_strategy_modal_open,
    onChangeDropdownItem  : quick_strategy.onChangeDropdownItem,
    onChangeInputValue    : quick_strategy.onChangeInputValue,
    onChangeSymbolInput   : quick_strategy.onChangeSymbolInput,
    onHideDropdownList    : quick_strategy.onHideDropdownList,
    setActiveTabIndex     : quick_strategy.setActiveTabIndex,
    symbol_dropdown       : quick_strategy.symbol_dropdown,
    toggleStrategyModal   : quick_strategy.toggleStrategyModal,
    trade_type_dropdown   : quick_strategy.trade_type_dropdown,
    validateQuickStrategy : quick_strategy.validateQuickStrategy,
}))(QuickStrategy);
