
import classnames       from 'classnames';
import proptypes        from 'prop-types';
import React            from 'react';
import {
    Button,
    Dropdown,
    Input,
    Modal,
    Tabs,
    UnderlyingIcon,
}                       from 'deriv-components';
import {
    Formik,
    Form,
    Field,
}                       from 'formik';
import IconTradeType    from './icon-trade-types.jsx';
import { connect }      from '../stores/connect';
import { translate }    from '../utils/lang/i18n';
import config           from '../constants/index';
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

const validateQuickStrategy = values => {
    const errors = {};
    const number_field = ['stake', 'size', 'profit', 'loss'];

    Object.keys(values).forEach(key => {
        const value = values[key];

        if (number_field.includes(key)){
            if (isNaN(value)) {
                errors[key] = translate('Must be a number');
            }

            if (value < 1){
                errors[key] = translate('Must be a number higher than 0');
            }
        }

        if (value === '') {
            errors[key] = translate('Field cannot be empty');
        }

    });

    return errors;
};

class QuickStrategy extends React.PureComponent {
    componentDidMount() {
        this.props.onMount();
    }

    render() {
        const {
            active_index,
            createStrategy,
            initial_values,
            is_strategy_modal_open,
            market_dropdown,
            onChangeMarketDropdown,
            onChangeTradeTypeDropdown,
            setActiveTabIndex,
            toggleStrategyModal,
            trade_type_dropdown,
        }                             = this.props;
        const { strategies }          = config;
        const asset_dropdown_options = {};
        
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

        return (
            <Modal
                title={translate('Quick strategy')}
                className='modal--strategy'
                is_open={is_strategy_modal_open}
                toggleModal={toggleStrategyModal}
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
                                        tradetype,
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
                                                name='tradetype'
                                                value={tradetype}
                                                onChange={e => onChangeTradeTypeDropdown(setFieldValue, e.target.value)}
                                            />
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
                                                        label={translate('Maximum loss')}
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
                                                        label={translate('Size')}
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
                                                        label={translate('Maximum profit')}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <div className='quick-strategy__form-footer' >
                                            <Button
                                                type='submit'
                                                className={classnames(
                                                    'btn--primary',
                                                    'btn--primary--red',
                                                    'quick-strategy__button--create',
                                                )}
                                                text={translate('Create')}
                                                is_disabled={!isValid || isSubmitting}
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
    }
}

QuickStrategy.propTypes = {
    active_index          : proptypes.number,
    createStrategy        : proptypes.func,
    initial_values        : proptypes.object,
    is_strategy_modal_open: proptypes.bool,
    market_dropdown       : proptypes.oneOfType([
        proptypes.array,
        proptypes.object,
    ]),
    onChangeMarketDropdown   : proptypes.func,
    onChangeTradeTypeDropdown: proptypes.func,
    onMount                  : proptypes.func,
    setActiveTabIndex        : proptypes.func,
    toggleStrategyModal      : proptypes.func,
    trade_type_dropdown      : proptypes.oneOfType([
        proptypes.array,
        proptypes.object,
    ]),
};

export default connect(({ quick_strategy }) => ({
    active_index             : quick_strategy.active_index,
    createStrategy           : quick_strategy.createStrategy,
    is_strategy_modal_open   : quick_strategy.is_strategy_modal_open,
    initial_values           : quick_strategy.initial_values,
    market_dropdown          : quick_strategy.market_dropdown,
    onChangeMarketDropdown   : quick_strategy.onChangeMarketDropdown,
    onChangeTradeTypeDropdown: quick_strategy.onChangeTradeTypeDropdown,
    onMount                  : quick_strategy.onMount,
    setActiveTabIndex        : quick_strategy.setActiveTabIndex,
    toggleStrategyModal      : quick_strategy.toggleStrategyModal,
    trade_type_dropdown      : quick_strategy.trade_type_dropdown,
}))(QuickStrategy);
