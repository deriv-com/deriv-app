import proptypes            from 'prop-types';
import React                from 'react';
import {
    Button,
    Dropdown,
    Input,
    Modal,
    UnderlyingIcon,
    Popover,
    Tabs,
}                           from 'deriv-components';
import {
    Formik,
    Form,
    Field,
}                           from 'formik';
import { localize }         from 'deriv-translations';
import IconTradeType        from './icon-trade-types.jsx';
import { InfoOutlineIcon }  from './Icons.jsx';
import { connect }          from '../stores/connect';
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

const QuickStrategyForm = ({
    active_index,
    asset_dropdown_options,
    createStrategy,
    duration_dropdown_options,
    getSizeDesc,
    getSizeText,
    initial_values,
    onChangeDurationDropdown,
    onChangeMarketDropdown,
    onChangeTradeTypeDropdown,
    trade_type_dropdown_options,
    validateQuickStrategy,
}) => (
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
                                placeholder={localize('Assets')}
                                is_align_text_left
                                list={asset_dropdown_options}
                                name='symbol'
                                value={symbol}
                                onChange={e =>
                                    onChangeMarketDropdown(
                                        setFieldValue,
                                        e.target.value)
                                }
                            />
                        </div>
                        <div className='quick-strategy__form-row'>
                            <Dropdown
                                placeholder={localize('Trade type')}
                                is_align_text_left
                                list={trade_type_dropdown_options}
                                name='trade_type'
                                value={trade_type}
                                onChange={e =>
                                    onChangeTradeTypeDropdown(
                                        setFieldValue,
                                        symbol,
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        <div className='quick-strategy__form-row'>
                            <Dropdown
                                className='quick-strategy__duration-dropdown'
                                placeholder={localize('Duration type')}
                                is_align_text_left
                                list={duration_dropdown_options}
                                name='duration_type'
                                value={duration_type}
                                onChange={e =>
                                    onChangeDurationDropdown(
                                        setFieldValue,
                                        e.target.value
                                    )
                                }
                            />
                            <Field name='duration'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className='quick-strategy__input'
                                        type='text'
                                        error={
                                            touched.duration
                                        && errors.duration
                                        }
                                        label={localize('Duration')}
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={
                                                    localize('The trade length of your purchased contract.')
                                                }
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
                                        label={localize('Initial stake')}
                                        placeholder='10'
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={
                                                    localize('The amount that you pay to enter a trade.')
                                                }
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
                                        label={localize('Loss Threshold')}
                                        placeholder='5000'
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={
                                                    localize('The bot will stop trading if your total loss exceeds this amount.')
                                                }
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
                                        label={getSizeText(active_index)}
                                        placeholder='2'
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={
                                                    getSizeDesc(active_index)
                                                }
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
                                        label={localize('Profit Threshold')}
                                        placeholder='5000'
                                        trailing_icon={
                                            <Popover
                                                alignment='bottom'
                                                message={localize('The bot will stop trading if your total profit exceeds this amount.')}
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
                                text={localize('Create')}
                                is_disabled={!isValid || isSubmitting}
                                primary
                            />
                        </div>
                    </Form>
                )
            }
        </Formik>
    </div>
);

const QuickStrategy = ({
    active_index,
    createStrategy,
    duration_dropdown,
    getSizeDesc,
    getSizeText,
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
                        onClickTabItem={setActiveTabIndex}
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
                                                asset_dropdown_options={asset_dropdown_options}
                                                createStrategy={createStrategy}
                                                duration_dropdown_options={duration_dropdown_options}
                                                getSizeDesc={getSizeDesc}
                                                getSizeText={getSizeText}
                                                initial_values={initial_values}
                                                onChangeDurationDropdown={onChangeDurationDropdown}
                                                onChangeMarketDropdown={onChangeMarketDropdown}
                                                onChangeTradeTypeDropdown={onChangeTradeTypeDropdown}
                                                trade_type_dropdown_options={trade_type_dropdown_options}
                                                validateQuickStrategy={validateQuickStrategy}
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
    active_index             : proptypes.number,
    createStrategy           : proptypes.func,
    duration_dropdown        : proptypes.array,
    getSizeDesc              : proptypes.func,
    getSizeText              : proptypes.func,
    initial_values           : proptypes.object,
    is_strategy_modal_open   : proptypes.bool,
    market_dropdown          : proptypes.object,
    onChangeDurationDropdown : proptypes.func,
    onChangeMarketDropdown   : proptypes.func,
    onChangeTradeTypeDropdown: proptypes.func,
    setActiveTabIndex        : proptypes.func,
    toggleStrategyModal      : proptypes.func,
    trade_type_dropdown      : proptypes.object,
    validateQuickStrategy    : proptypes.func,
};

export default connect(({ quick_strategy }) => ({
    active_index             : quick_strategy.active_index,
    createStrategy           : quick_strategy.createStrategy,
    duration_dropdown        : quick_strategy.duration_dropdown,
    getSizeDesc              : quick_strategy.getSizeDesc,
    getSizeText              : quick_strategy.getSizeText,
    is_strategy_modal_open   : quick_strategy.is_strategy_modal_open,
    initial_values           : quick_strategy.initial_values,
    market_dropdown          : quick_strategy.market_dropdown,
    onChangeDurationDropdown : quick_strategy.onChangeDurationDropdown,
    onChangeMarketDropdown   : quick_strategy.onChangeMarketDropdown,
    onChangeTradeTypeDropdown: quick_strategy.onChangeTradeTypeDropdown,
    setActiveTabIndex        : quick_strategy.setActiveTabIndex,
    toggleStrategyModal      : quick_strategy.toggleStrategyModal,
    trade_type_dropdown      : quick_strategy.trade_type_dropdown,
    validateQuickStrategy    : quick_strategy.validateQuickStrategy,
}))(QuickStrategy);
