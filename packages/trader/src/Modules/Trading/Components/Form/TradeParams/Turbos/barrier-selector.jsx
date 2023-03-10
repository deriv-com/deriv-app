import PropTypes from 'prop-types';
import React from 'react';
import BarriersList from './barriers-list.jsx';
import TradeTypeTabs from './trade-type-tabs.jsx';
import { Button, Icon, MobileDialog, Text, Popover } from '@deriv/components';
import { connect } from 'Stores/connect';
import { CSSTransition } from 'react-transition-group';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';

const BarrierSelector = ({ barrier_1, onChange, setHoveredBarrier, turbos_barrier_choices }) => {
    const [is_barriers_table_expanded, setIsBarriersTableExpanded] = React.useState(false);
    const [is_mobile_tooltip_visible, setIsMobileTooltipVisible] = React.useState(false);
    const [selected_barrier, setSelectedBarrier] = React.useState(barrier_1);

    const toggleMobileTooltip = () => setIsMobileTooltipVisible(!is_mobile_tooltip_visible);

    const toggleBarriersTable = () => {
        setIsMobileTooltipVisible(false);
        setIsBarriersTableExpanded(!is_barriers_table_expanded);
        setSelectedBarrier(barrier_1);
    };

    const onBarrierClick = barrier => {
        setHoveredBarrier(null);
        setSelectedBarrier(barrier);
        if (!isMobile()) {
            onChange({
                target: {
                    name: 'barrier_1',
                    value: barrier,
                },
            });
        }
    };

    const onButtonClick = () => {
        onChange({
            target: {
                name: 'barrier_1',
                value: selected_barrier,
            },
        });
    };

    React.useEffect(() => {
        setSelectedBarrier(barrier_1);
    }, [barrier_1]);

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

    const barriers_header_mobile = (
        <div className='trade-container__barriers-table__header-tooltip'>
            <div>{localize('Barriers')}</div>
            <Popover
                alignment='bottom'
                icon='info'
                zIndex={9999}
                message={header_tooltip_text}
                is_open={is_mobile_tooltip_visible}
                onClick={toggleMobileTooltip}
            />
        </div>
    );

    const barriers_footer_mobile = (
        <div className='trade-container__barriers__footer'>
            <Button
                className='trade-container__barriers__footer__button'
                type='submit'
                text={localize('Select barrier')}
                large
                primary
                is_disabled={selected_barrier === barrier_1}
                onClick={onButtonClick}
            />
        </div>
    );

    return isMobile() ? (
        <React.Fragment>
            <div className='mobile-widget' onClick={toggleBarriersTable}>
                <Text size='xs' color='prominent' align='center'>
                    {localize('Spot')}
                </Text>
                <Text size='xs' color='prominent' align='center' weight='bold'>
                    {barrier_1}
                </Text>
                <Text size='xs' color='less-prominent' align='center'>
                    {localize('Barrier')}
                </Text>
            </div>
            <MobileDialog
                title={barriers_header_mobile}
                onClose={toggleBarriersTable}
                has_content_scroll={true}
                portal_element_id='modal_root'
                wrapper_classname='contracts-modal-list'
                visible={is_barriers_table_expanded}
                footer={barriers_footer_mobile}
                header_classname='trade-container__barriers-table__header'
            >
                <BarriersList
                    active_item_classname='trade-container__barriers-table__item--selected'
                    base_classname='trade-container__barriers-table__item'
                    className='trade-container__barriers-table__list'
                    list={turbos_barrier_choices}
                    selected_item={selected_barrier}
                    onClick={onBarrierClick}
                    onHover={barrier => setHoveredBarrier(barrier)}
                />
            </MobileDialog>
        </React.Fragment>
    ) : (
        <React.Fragment>
            <TradeTypeTabs />
            <Fieldset
                className='trade-container__fieldset trade-container__barriers'
                header={localize('Barrier')}
                is_center
                header_tooltip={header_tooltip_text}
            >
                <div onClick={toggleBarriersTable} className='trade-container__barriers__wrapper'>
                    <Text size='xs' className='trade-container__barriers-spot'>
                        {localize('Spot')}
                    </Text>
                    <Text size='xs' className='trade-container__barriers-value' data-testid='current_barrier'>
                        {barrier_1}
                    </Text>
                </div>
            </Fieldset>
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
                        <BarriersList
                            active_item_classname='trade-container__barriers-table__item--selected'
                            base_classname='trade-container__barriers-table__item'
                            className='trade-container__barriers-table__list'
                            list={turbos_barrier_choices}
                            selected_item={selected_barrier}
                            onClick={onBarrierClick}
                            onHover={barrier => setHoveredBarrier(barrier)}
                        />
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
