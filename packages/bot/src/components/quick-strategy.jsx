import proptypes            from 'prop-types';
import React                from 'react';
import {
    Button,
    Dropdown,
    Input,
    Modal,
    Tabs,
    UnderlyingIcon,
    Popover,
}                           from 'deriv-components';
import {
    Formik,
    Form,
    Field,
}                           from 'formik';
import IconTradeType        from './icon-trade-types.jsx';
import { InfoOutlineIcon }  from './Icons.jsx';
import { connect }          from '../stores/connect';
import { translate }        from '../utils/lang/i18n';
import config               from '../constants/index';
import '../assets/sass/quick-strategy.scss';

const MarketOption = ({ symbol }) => (
    <div key={symbol.value} className='quick-strategy__option'>
        <UnderlyingIcon market={symbol.value} />
        <span className='quick-strategy__symbol'>{symbol.name}</span>
    </div>
);

const TradetypeOption = ({ type }) => (
    <div key={type.value} className='quick-strategy__option'>
        <IconTradeType trade_type={type.icon[0]} className='quick-strategy__icon' />
        <IconTradeType trade_type={type.icon[1]} className='quick-strategy__icon' />
        <span className='quick-strategy__symbol'>{type.name}</span>
    </div>
);

const getSizeDesc = index => {
    switch (index) {
        case 0:
            return 'The multiplier amount used to increase your stake if you’re losing a trade.';
        case 1:
            return 'The amount that you may add to your stake if you’re losing a trade.';
        case 2:
            return 'The amount that you may add to your stake after each successful trade.';
        default:
            return '';
    }
};

const getSizeText = index => {
    switch (index) {
        case 0:
            return 'Size';
        case 1:
        case 2:
            return 'Units';
        default:
            return '';
    }
};

const QuickStrategy = ({
    active_index,
    createStrategy,
    duration_dropdown,
    initial_values,
    is_strategy_modal_open,
    market_dropdown,
    onChangeDurationDropdown,
    onChangeMarketDropdown,
    onChangeTradeTypeDropdown,
    setActiveTabIndex,
    toggleStrategyModal,
    trade_type_dropdown,
    validateQuickStrategy,
}) => {
    const { strategies }          = config;
    const asset_dropdown_options  = {};

    Object.assign(asset_dropdown_options, market_dropdown);
        
    if (asset_dropdown_options) {
        Object.keys(asset_dropdown_options).forEach(key => {
            const submarket = asset_dropdown_options[key];

            submarket.forEach(symbol => {
                symbol.text = <MarketOption symbol={symbol} />;
            });
        });
    }

    const trade_type_dropdown_options = {};

    Object.assign(trade_type_dropdown_options, trade_type_dropdown);

    if (trade_type_dropdown_options) {
        Object.keys(trade_type_dropdown_options).forEach(key => {
            const trade_type = trade_type_dropdown_options[key];

            trade_type.forEach(type => {
                type.text = <TradetypeOption type={type} />;
            });
        });
    }
        
    const duration_dropdown_options = Object.keys(duration_dropdown).map(key => {
        const duration = duration_dropdown[key];
        return { text: duration.display, value: duration.unit };
    });

    return (
        <Modal
            title={translate('Quick strategy')}
            className='modal--strategy'
            is_open={is_strategy_modal_open}
            toggleModal={toggleStrategyModal}
            width={'460px'}
        >
            <div className='modal__content'>
                <div className='quick-strategy__tabs'>
                    <Tabs
                        active_index={active_index}
                        onClickTabItem={setActiveTabIndex}
                    >
                        {
                            Object.keys(strategies).map(key => {
                                const { index, label, description } = strategies[key];
                                return (
                                    <div key={index} label={label}>
                                        <div className='quick-strategy__description'>{description}</div>
                                    </div>
                                );
                            })
                        }
                    </Tabs>
                </div>
            </div>
            <div className='modal__footer'>
                <div className='quick-strategy__form'>
                    <Formik
                        initialValues={initial_values}
                        validate={validateQuickStrategy}
                        onSubmit={createStrategy}
                    >
                        {
                            ({
                                errors,
                                isValid,
                                isSubmitting,
                                values : {
                                    symbol,
                                    trade_type,
                                    duration_type,
                                },
                                setFieldValue,
                                touched,
                            }) => (
                                <Form>
                                    <div className='quick-strategy__form-row'>
                                        <Dropdown
                                            placeholder={translate('Assets')}
                                            is_align_text_left
                                            list={asset_dropdown_options}
                                            name='symbol'
                                            value={symbol}
                                            onChange={e => onChangeMarketDropdown(setFieldValue, e.target.value)}
                                        />
                                    </div>
                                    <div className='quick-strategy__form-row'>
                                        <Dropdown
                                            placeholder={translate('Trade type')}
                                            is_align_text_left
                                            list={trade_type_dropdown_options}
                                            name='trade_type'
                                            value={trade_type}
                                            onChange={e =>
                                                onChangeTradeTypeDropdown(setFieldValue, symbol, e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className='quick-strategy__form-row'>
                                        <Dropdown
                                            className='quick-strategy__duration-dropdown'
                                            placeholder={translate('Duration Type')}
                                            is_align_text_left
                                            list={duration_dropdown_options}
                                            name='duration_type'
                                            value={duration_type}
                                            onChange={e =>
                                                onChangeDurationDropdown(setFieldValue, e.target.value)
                                            }
                                        />
                                        <Field name='duration'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    className='quick-strategy__input'
                                                    type='text'
                                                    error={touched.duration && errors.duration}
                                                    label={translate('Duration')}
                                                    trailing_icon={
                                                        <Popover
                                                            alignment='bottom'
                                                            message={translate('The trade length of your purchased contract.')}
                                                        >
                                                            <InfoOutlineIcon />
                                                        </Popover>
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='quick-strategy__form-row'>
                                        <Field name='stake'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    className='quick-strategy__input'
                                                    type='text'
                                                    error={touched.stake && errors.stake}
                                                    label={translate('Initial stake')}
                                                    placeholder='10'
                                                    trailing_icon={
                                                        <Popover
                                                            alignment='bottom'
                                                            message={translate('The amount that you pay to enter a trade.')}
                                                        >
                                                            <InfoOutlineIcon />
                                                        </Popover>
                                                    }
                                                />
                                            )}
                                        </Field>
                                        <Field name='loss'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    className='quick-strategy__input'
                                                    type='text'
                                                    error={touched.loss && errors.loss}
                                                    label={translate('Loss Threshold')}
                                                    placeholder='5000'
                                                    trailing_icon={
                                                        <Popover
                                                            alignment='bottom'
                                                            message={translate('The bot will stop trading if your total loss exceeds this amount.')}
                                                        >
                                                            <InfoOutlineIcon />
                                                        </Popover>
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='quick-strategy__form-row'>
                                        <Field name='size'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    className='quick-strategy__input'
                                                    type='text'
                                                    error={touched.size && errors.size}
                                                    label={translate(getSizeText(active_index))}
                                                    placeholder='2'
                                                    trailing_icon={
                                                        <Popover
                                                            alignment='bottom'
                                                            message={translate(getSizeDesc(active_index))}
                                                        >
                                                            <InfoOutlineIcon />
                                                        </Popover>
                                                    }
                                                />
                                            )}
                                        </Field>
                                        <Field name='profit'>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    className='quick-strategy__input'
                                                    type='text'
                                                    error={touched.profit && errors.profit}
                                                    label={translate('Profit Threshold')}
                                                    placeholder='5000'
                                                    trailing_icon={
                                                        <Popover
                                                            alignment='bottom'
                                                            message={translate('The bot will stop trading if your total profit exceeds this amount.')}
                                                        >
                                                            <InfoOutlineIcon />
                                                        </Popover>
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </div>
                                    <div className='quick-strategy__form-footer' >
                                        <Button
                                            type='submit'
                                            className='quick-strategy__button--create'
                                            text={translate('Create')}
                                            is_disabled={!isValid || isSubmitting}
                                            primary
                                        />
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>
                </div>
            </div>
        </Modal>
    );
};

QuickStrategy.propTypes = {
    active_index             : proptypes.number,
    createStrategy           : proptypes.func,
    duration_dropdown        : proptypes.array,
    initial_values           : proptypes.object,
    is_strategy_modal_open   : proptypes.bool,
    market_dropdown          : proptypes.object,
    onChangeDurationDropdown : proptypes.func,
    onChangeMarketDropdown   : proptypes.func,
    onChangeTradeTypeDropdown: proptypes.func,
    onMount                  : proptypes.func,
    setActiveTabIndex        : proptypes.func,
    toggleStrategyModal      : proptypes.func,
    trade_type_dropdown      : proptypes.object,
    validateQuickStrategy    : proptypes.func,
};

export default connect(({ quick_strategy }) => ({
    active_index             : quick_strategy.active_index,
    createStrategy           : quick_strategy.createStrategy,
    duration_dropdown        : quick_strategy.duration_dropdown,
    is_strategy_modal_open   : quick_strategy.is_strategy_modal_open,
    initial_values           : quick_strategy.initial_values,
    market_dropdown          : quick_strategy.market_dropdown,
    onChangeDurationDropdown : quick_strategy.onChangeDurationDropdown,
    onChangeMarketDropdown   : quick_strategy.onChangeMarketDropdown,
    onChangeTradeTypeDropdown: quick_strategy.onChangeTradeTypeDropdown,
    onMount                  : quick_strategy.onMount,
    setActiveTabIndex        : quick_strategy.setActiveTabIndex,
    toggleStrategyModal      : quick_strategy.toggleStrategyModal,
    trade_type_dropdown      : quick_strategy.trade_type_dropdown,
    validateQuickStrategy    : quick_strategy.validateQuickStrategy,
}))(QuickStrategy);
