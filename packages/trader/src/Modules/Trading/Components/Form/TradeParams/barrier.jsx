import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Icon, InputField, MobileWrapper } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';
import LabeledQuantityInputMobile from '../LabeledQuantityInputMobile';

const Barrier = ({
    barrier_1,
    barrier_2,
    barrier_count,
    barrier_pipsize,
    current_focus,
    duration_unit,
    is_minimized,
    is_absolute_only,
    onChange,
    setCurrentFocus,
    validation_errors,
}) => {
    const barrier_title = barrier_count === 1 ? localize('Barrier') : localize('Barriers');

    if (is_minimized) {
        return barrier_count !== 2 ? (
            <div className='fieldset-minimized fieldset-minimized__barrier1'>{barrier_1}</div>
        ) : (
            <React.Fragment>
                <div className='fieldset-minimized fieldset-minimized__barrier1'>{barrier_1}</div>
                <div className='fieldset-minimized fieldset-minimized__barrier2'>{barrier_2}</div>
            </React.Fragment>
        );
    }

    const input_class = barrier_count === 2 ? 'multiple' : 'single';
    const is_day_duration = duration_unit === 'd';
    // TODO: Some contracts yet to be implemented in app.deriv.com allow only absolute barrier, hence the prop
    const is_absolute_barrier = is_day_duration || is_absolute_only;

    const format = value => {
        const float_value = parseFloat(value);
        let final_value;
        if (Math.sign(float_value) === -1) {
            final_value = float_value.toFixed(barrier_pipsize).toString();
        } else {
            final_value = `+${float_value.toFixed(barrier_pipsize)}`;
        }
        return final_value;
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Fieldset
                    className='trade-container__fieldset trade-container__barriers'
                    header={barrier_title}
                    is_center
                >
                    <div>
                        <InputField
                            id='dt_barrier_1_input'
                            type='number'
                            name='barrier_1'
                            value={barrier_1}
                            className={`trade-container__barriers-${input_class}`}
                            classNameInput={classNames(
                                'trade-container__input',
                                'trade-container__barriers-input',
                                `trade-container__barriers-${input_class}-input`
                            )}
                            current_focus={current_focus}
                            onChange={onChange}
                            error_messages={validation_errors.barrier_1 || []}
                            is_float
                            is_signed
                            setCurrentFocus={setCurrentFocus}
                        />

                        {barrier_count === 2 && (
                            <React.Fragment>
                                <InputField
                                    id='dt_barrier_2_input'
                                    type='number'
                                    name='barrier_2'
                                    value={barrier_2}
                                    className='multiple'
                                    classNameInput='trade-container__input'
                                    current_focus={current_focus}
                                    onChange={onChange}
                                    error_messages={validation_errors.barrier_2}
                                    is_float
                                    is_signed
                                    setCurrentFocus={setCurrentFocus}
                                />
                                <Icon icon='IcArrowUp' className='trade-container__barriers--up' />
                                <Icon icon='IcArrowDown' className='trade-container__barriers--down' />
                            </React.Fragment>
                        )}
                    </div>
                </Fieldset>
            </DesktopWrapper>
            <MobileWrapper>
                <LabeledQuantityInputMobile
                    input_label={barrier_count === 2 ? localize('Barrier 1') : localize('Barrier')}
                    id='dt_barrier_1_input'
                    type='number'
                    name='barrier_1'
                    value={barrier_1}
                    is_incrementable={!is_absolute_barrier}
                    is_incrementable_on_long_press={!is_absolute_barrier}
                    is_negative_disabled={is_absolute_barrier}
                    className={`barrier__fields-${input_class}`}
                    classNameInput={classNames(
                        'barrier__fields-input',
                        'barrier__fields-barriers-input',
                        `barrier__fields-barriers-${input_class}-input`,
                        {
                            'barrier__fields-input--is-offset': !is_absolute_barrier,
                        }
                    )}
                    current_focus={current_focus}
                    format={format}
                    onChange={onChange}
                    is_float
                    is_signed
                    setCurrentFocus={setCurrentFocus}
                />
                {barrier_count === 2 && (
                    <LabeledQuantityInputMobile
                        input_label={localize('Barrier 2')}
                        id='dt_barrier_2_input'
                        type='number'
                        name='barrier_2'
                        value={barrier_2}
                        is_incrementable={!is_absolute_barrier}
                        is_incrementable_on_long_press={!is_absolute_barrier}
                        is_negative_disabled={is_absolute_barrier}
                        className={`barrier__fields-${input_class}`}
                        classNameInput={classNames(
                            'barrier__fields-input',
                            'barrier__fields-barriers-input',
                            `barrier__fields-barriers-${input_class}-input`,
                            {
                                'barrier__fields-input--is-offset': !is_absolute_barrier,
                            }
                        )}
                        current_focus={current_focus}
                        format={format}
                        onChange={onChange}
                        is_float
                        is_signed
                        setCurrentFocus={setCurrentFocus}
                    />
                )}
            </MobileWrapper>
        </React.Fragment>
    );
};

Barrier.propTypes = {
    barrier_1: PropTypes.string,
    barrier_2: PropTypes.string,
    barrier_count: PropTypes.number,
    barrier_pipsize: PropTypes.number,
    current_focus: PropTypes.string,
    duration_unit: PropTypes.string,
    is_absolute_only: PropTypes.bool,
    is_minimized: PropTypes.bool,
    onChange: PropTypes.func,
    setCurrentFocus: PropTypes.func,
    validation_errors: PropTypes.object,
};

export default connect(({ modules, ui }) => ({
    barrier_1: modules.trade.barrier_1,
    barrier_2: modules.trade.barrier_2,
    barrier_pipsize: modules.trade.barrier_pipsize,
    barrier_count: modules.trade.barrier_count,
    current_focus: ui.current_focus,
    duration_unit: modules.trade.duration_unit,
    onChange: modules.trade.onChange,
    setCurrentFocus: ui.setCurrentFocus,
    validation_errors: modules.trade.validation_errors,
}))(Barrier);
