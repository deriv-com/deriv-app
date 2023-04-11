import React from 'react';
import BarriersList from '../barriers-list';
import { DesktopWrapper, Icon, MobileDialog, MobileWrapper, Text, Popover } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';

const BarrierSelector = observer(() => {
    const {
        modules: { trade },
    } = useStore();
    const { barrier_1, onChange, setHoveredBarrier, barrier_choices } = trade;
    const [is_barriers_table_expanded, setIsBarriersTableExpanded] = React.useState(false);
    const [is_mobile_tooltip_visible, setIsMobileTooltipVisible] = React.useState(false);
    const [selected_barrier, setSelectedBarrier] = React.useState(barrier_1);

    const toggleMobileTooltip = () => setIsMobileTooltipVisible(!is_mobile_tooltip_visible);

    const toggleBarriersTable = () => {
        setIsMobileTooltipVisible(false);
        setIsBarriersTableExpanded(!is_barriers_table_expanded);
    };

    const onBarrierClick = (barrier: string) => {
        setHoveredBarrier('');
        setSelectedBarrier(barrier);
        onChange({
            target: {
                name: 'barrier_1',
                value: barrier,
            },
        });
        setIsBarriersTableExpanded(false);
    };

    React.useEffect(() => {
        setSelectedBarrier(barrier_1);
    }, [barrier_1]);

    const header_tooltip_text = ['Long', 'Short'].map(type => (
        <div key={type} className='trade-container__barriers-tooltip'>
            <Localize
                i18n_default_text="<0>For {{type}}: </0>You will get a payout if the market price stays {{payout_status}} the barrier and doesn't touch or cross the barrier. Otherwise, your payout will be zero."
                components={[<Text key={0} weight='bold' size='xxs' />]}
                values={{ type, payout_status: type === 'Long' ? 'above' : 'below' }}
            />
        </div>
    ));

    const barriers_header_mobile = (
        <div className='trade-container__barriers-table__header-wrapper'>
            <div>{localize('Barriers')}</div>
            <Popover
                alignment='bottom'
                icon='info'
                zIndex='9999'
                message={header_tooltip_text}
                is_open={is_mobile_tooltip_visible}
                onClick={toggleMobileTooltip}
            />
        </div>
    );

    return (
        <React.Fragment>
            <MobileWrapper>
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
                    portal_element_id='modal_root'
                    wrapper_classname='contracts-modal-list'
                    visible={is_barriers_table_expanded}
                    header_classname='trade-container__barriers-table__header'
                >
                    <BarriersList
                        className='trade-container__barriers-table'
                        header={localize('Barriers')}
                        barriers_list={barrier_choices}
                        selected_item={selected_barrier}
                        show_table={is_barriers_table_expanded}
                        subheader={localize('Distance to current spot')}
                        onClick={onBarrierClick}
                        onClickCross={toggleBarriersTable}
                        onHover={setHoveredBarrier}
                    />
                </MobileDialog>
            </MobileWrapper>
            <DesktopWrapper>
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
                            <Icon icon='IcChevronLeft' className='trade-container__barriers-value--arrow-right' />
                        </Text>
                    </div>
                </Fieldset>
                {is_barriers_table_expanded && (
                    <BarriersList
                        className='trade-container__barriers-table'
                        header={localize('Barriers')}
                        barriers_list={barrier_choices}
                        selected_item={selected_barrier}
                        show_table={is_barriers_table_expanded}
                        subheader={localize('Distance to current spot')}
                        onClick={onBarrierClick}
                        onClickCross={toggleBarriersTable}
                        onHover={setHoveredBarrier}
                    />
                )}
            </DesktopWrapper>
        </React.Fragment>
    );
});

export default BarrierSelector;
