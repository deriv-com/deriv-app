import PropTypes from 'prop-types';
import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { CSSTransition } from 'react-transition-group';
import { Icon, Text, ThemedScrollbars } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import BarriersList from './barriers-list.jsx';

const BarrierSelector = ({ barrier_1, onChange, setHoveredBarrier, turbos_barrier_choices }) => {
    const [selected_barrier, setSelectedBarrier] = React.useState(barrier_1);
    const [is_barriers_table_expanded, setIsBarriersTableExpanded] = React.useState(false);

    const header_tooltip_text = (
        <React.Fragment>
            <div className='trade-container__barriers-tooltip'>
                <Localize
                    i18n_default_text="<0>For Long: </0>You will earn profit if the market stays above the entry spot and doesn't cross the barrier."
                    components={[<Text key={0} weight='bold' size='xxs' />]}
                />
            </div>
            <Localize
                i18n_default_text="<0>For Short: </0>You will earn profit if the market stays below the entry spot and doesn't cross the barrier."
                components={[<Text key={0} weight='bold' size='xxs' />]}
            />
        </React.Fragment>
    );

    const toggleBarriersTable = () => setIsBarriersTableExpanded(!is_barriers_table_expanded);

    const onBarrierClick = barrier => {
        setHoveredBarrier(null);
        setSelectedBarrier(barrier);
        onChange({
            target: {
                name: 'barrier_1',
                value: barrier,
            },
        });
    };

    React.useEffect(() => {
        if (barrier_1 !== selected_barrier) {
            setSelectedBarrier(barrier_1);
        }
    }, [barrier_1, selected_barrier]);

    return (
        <React.Fragment>
            {isMobile() ? (
                <div className='mobile-widget'>
                    <div className='mobile-widget__spot'>{localize('Spot')}</div>
                    <div className='mobile-widget__barriers-value'>{barrier_1}</div>
                    <div className='mobile-widget__barrier'>{localize('Barrier')}</div>
                </div>
            ) : (
                <Fieldset
                    className='trade-container__fieldset trade-container__barriers'
                    header={localize('Barrier')}
                    is_center
                    header_tooltip={header_tooltip_text}
                >
                    <div onClick={toggleBarriersTable} className='trade-container__barriers__wrapper'>
                        <div className='trade-container__barriers-spot'>{localize('Spot')}</div>
                        <div className='trade-container__barriers-value'>{barrier_1}</div>
                    </div>
                </Fieldset>
            )}
            {is_barriers_table_expanded && (
                <CSSTransition
                    appear
                    in={is_barriers_table_expanded}
                    timeout={250}
                    classNames={{
                        appear: 'trade-container__barriers-table--enter',
                        enter: 'trade-container__barriers-table--enter',
                        enterDone: 'trade-container__barriers-table--enter-done',
                        exit: 'trade-container__barriers-table--exit',
                    }}
                    unmountOnExit
                >
                    <Fieldset className='trade-container__fieldset trade-container__barriers-table'>
                        <div className='trade-container__barriers-table__header'>
                            <Text color='prominent' weight='bold' size='xs'>
                                {localize('Barriers')}
                            </Text>
                            <div className='trade-container__barriers-table__icon-close' onClick={toggleBarriersTable}>
                                <Icon icon='IcCross' />
                            </div>
                        </div>
                        <div className='trade-container__barriers-table__text'>Distance to spot</div>
                        <ThemedScrollbars>
                            <BarriersList
                                base_classname='trade-container__barriers-table__item'
                                active_item_classname='trade-container__barriers-table__item--selected'
                                className='trade-container__barriers-table__list'
                                list={turbos_barrier_choices}
                                selected_item={selected_barrier}
                                onClick={onBarrierClick}
                                onHover={barrier => setHoveredBarrier(barrier)}
                            />
                        </ThemedScrollbars>
                    </Fieldset>
                </CSSTransition>
            )}
        </React.Fragment>
    );
};
BarrierSelector.propTypes = {
    barrier_1: PropTypes.string,
    onChange: PropTypes.func,
    setHoveredBarrier: PropTypes.func,
    turbos_barrier_choices: PropTypes.arrayOf(PropTypes.string),
};

export default connect(({ modules }) => ({
    barrier_1: modules.trade.barrier_1,
    onChange: modules.trade.onChange,
    setHoveredBarrier: modules.trade.setHoveredBarrier,
    turbos_barrier_choices: modules.trade.turbos_barrier_choices,
}))(BarrierSelector);
