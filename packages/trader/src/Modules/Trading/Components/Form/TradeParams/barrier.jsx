import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Icon } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import InputField from 'App/Components/Form/InputField';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';

const Barrier = ({
    barrier_1,
    barrier_2,
    barrier_count,
    barrier_pipsize,
    is_minimized,
    onChange,
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
                            onChange={onChange}
                            error_messages={validation_errors.barrier_1 || []}
                            is_float
                            is_signed
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
                                    onChange={onChange}
                                    error_messages={validation_errors.barrier_2}
                                    is_float
                                    is_signed
                                />
                                <Icon icon='IcArrowUp' className='trade-container__barriers--up' />
                                <Icon icon='IcArrowDown' className='trade-container__barriers--down' />
                            </React.Fragment>
                        )}
                    </div>
                </Fieldset>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='barrier__widget'>
                    <Fieldset className='barrier__fields'>
                        <InputField
                            id='dt_barrier_1_input'
                            type='number'
                            name='barrier_1'
                            value={barrier_1}
                            is_incrementable
                            is_negative_disabled={false}
                            className={`barrier__fields-${input_class}`}
                            classNameInput={classNames(
                                'barrier__fields-input',
                                'barrier__fields-barriers-input',
                                `barrier__fields-barriers-${input_class}-input`
                            )}
                            onChange={e => {
                                const float_value = parseFloat(e.target.value);
                                let final_value;
                                if (Math.sign(float_value) === -1) {
                                    final_value = float_value.toFixed(barrier_pipsize).toString();
                                } else {
                                    final_value = `+${float_value.toFixed(barrier_pipsize)}`;
                                }
                                onChange({ target: { name: e.target.name, value: final_value } });
                            }}
                            is_float
                            is_signed
                        />

                        {/* {barrier_count === 2 && ( */}
                        {/*    <React.Fragment> */}
                        {/*        <InputField */}
                        {/*            id='dt_barrier_2_input' */}
                        {/*            type='number' */}
                        {/*            name='barrier_2' */}
                        {/*            value={barrier_2} */}
                        {/*            is_incrementable */}
                        {/*            is_negative_disabled={false} */}
                        {/*            className='barrier-fields-multiple' */}
                        {/*            classNameInput='barrier-fields__input' */}
                        {/*            onChange={onChange} */}
                        {/*            is_float */}
                        {/*            is_signed */}
                        {/*        /> */}
                        {/*        <Icon icon='IcArrowUp' className='barrier-fields__barriers--up' /> */}
                        {/*        <Icon icon='IcArrowDown' className='barrier-fields__barriers--down' /> */}
                        {/*    </React.Fragment> */}
                        {/* )} */}
                    </Fieldset>
                    <h2 className='barrier__widget-title'>{barrier_title}</h2>
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
};

Barrier.propTypes = {
    barrier_1: PropTypes.string,
    barrier_2: PropTypes.string,
    barrier_count: PropTypes.number,
    barrier_pipsize: PropTypes.number,
    is_minimized: PropTypes.bool,
    onChange: PropTypes.func,
    validation_errors: PropTypes.object,
};

export default connect(({ modules }) => ({
    barrier_1: modules.trade.barrier_1,
    barrier_2: modules.trade.barrier_2,
    barrier_pipsize: modules.trade.barrier_pipsize,
    barrier_count: modules.trade.barrier_count,
    onChange: modules.trade.onChange,
    validation_errors: modules.trade.validation_errors,
}))(Barrier);
