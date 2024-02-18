import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { useSwipeable } from 'react-swipeable';
import { Icon } from '@deriv/components';
import NewTradeTypeWidget from './new-trade-type-widget';
import NewTradeParamsContainer from './new-trade-params-container';
import NewTradeParamPopupWrapper from './new-trade-param-popup-wrapper';
import NewFooterNavigation from './new-footer-navigation';

const NewTrade = () => {
    const [show_details, setShowDetails] = React.useState(false);
    const [is_risk_management, setIsRiskManagement] = React.useState(false);
    const [is_stake, setIsStake] = React.useState(false);
    const [is_multiplier, setIsMultiplier] = React.useState(false);
    const [is_duration, setIsDuration] = React.useState(false);

    const [is_portal, setIsPortal] = React.useState(false);
    const [selected_left_type, setSelectedType] = React.useState(true);
    const [selected_chart_tab, setSelectedChartType] = React.useState(true);

    // const [show_purchase_details, setShowPurchaseDetails] = React.useState(false);

    const optionGroups = {
        multipliers: [
            { value: '5', label: '5' },
            { value: '10', label: '10' },
            { value: '15', label: '15' },
            { value: '20', label: '20' },
            { value: '30', label: '30' },
        ],
    };
    const [valueGroups, setValueGroups] = React.useState({ multipliers: '5' });

    const onTradeParamClickHandler = (trade_param: string) => {
        setIsRiskManagement(false);
        setIsStake(false);
        setIsMultiplier(false);
        setIsDuration(false);

        if (trade_param === 'risk_management') setIsRiskManagement(true);
        if (trade_param === 'stake') setIsStake(true);
        if (trade_param === 'multiplier') setIsMultiplier(true);
        if (trade_param === 'duration') setIsDuration(true);

        setShowDetails(true);
    };

    // const onPurchaseResult = (e: React.MouseEvent<HTMLDivElement>) => {
    //     e.stopPropagation();
    //     setShowPurchaseDetails(!show_purchase_details);
    // };
    // const swipe_handlers = useSwipeable({
    //     onSwipedDown: () => setShowPurchaseDetails(!show_purchase_details),
    //     onSwipedUp: () => setShowPurchaseDetails(!show_purchase_details),
    // });

    return (
        <React.Fragment>
            <div className='content_container'>
                <NewTradeTypeWidget />
                <NewTradeParamsContainer
                    onClick={onTradeParamClickHandler}
                    setSelectedType={setSelectedType}
                    selected_left_type={selected_left_type}
                    selected_multiplier={valueGroups.multipliers}
                />
                <div
                    style={{ margin: '0.8rem 0rem', backgroundColor: 'var(--general-main-1)', borderRadius: '0.8rem' }}
                >
                    <div className='tabs__container'>
                        <div
                            className={classNames('tabs__section', {
                                'tabs__section-selected': selected_chart_tab,
                            })}
                            onClick={() => setSelectedChartType(true)}
                        >
                            Chart
                        </div>
                        <div
                            className={classNames('tabs__section', {
                                'tabs__section-selected': !selected_chart_tab,
                            })}
                            onClick={() => setSelectedChartType(false)}
                        >
                            Learn
                        </div>
                    </div>
                    {selected_chart_tab ? (
                        <Icon icon='IcNewChart' className='new-chart-icon' />
                    ) : (
                        <div className='tabs__section__container'>
                            <div className='tabs__section__video-mock'>Video Mock</div>
                            <p className='tabs__section__paragraph'>
                                Turbo options allow you to predict the direction of the underlying asset’s movements.
                            </p>
                            <p className='tabs__section__paragraph'>
                                You receive a payout at expiry if the spot price never touches or breaches the barrier
                                during the contract period. If it does, your contract will be terminated early.
                            </p>
                            <p className='tabs__section__paragraph'>
                                If you select “Long”, you’ll earn a payout if the spot price never drops below the
                                barrier.
                            </p>
                            <div className='tabs__section__gif'>GIF</div>
                            <p className='tabs__section__paragraph'>
                                If you select “Short”, you’ll earn a payout if the spot price never rises above the
                                barrier.
                            </p>
                            <div className='tabs__section__gif'>GIF</div>
                            <p className='tabs__section__paragraph'>
                                Your payout is equal to the payout per point multiplied by the difference between the
                                final price and the barrier. You will only earn a profit if your payout is higher than
                                your initial stake.
                            </p>
                            <p className='tabs__section__paragraph'>
                                You may sell the contract up to 15 seconds before expiry. If you do, we’ll pay you the
                                contract value.
                            </p>
                            <p className='tabs__section__paragraph'>
                                If you choose your duration in number of ticks, you won’t be able to terminate your
                                contract early.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <NewTradeParamPopupWrapper
                onClick={() => {
                    setShowDetails(false);
                    setTimeout(() => setIsPortal(false), 300);
                }}
                show_details={show_details}
                is_risk_management={is_risk_management}
                is_stake={is_stake}
                is_portal={is_portal}
                is_multiplier={is_multiplier}
                is_duration={is_duration}
                valueGroups={valueGroups}
                optionGroups={optionGroups}
                setValueGroups={setValueGroups}
            />
            {/* <div
                className={show_purchase_details && !show_details ? 'trade-param_popup_overlay' : ''}
                onClick={onPurchaseResult}
            >
                <div className='footer-new' {...swipe_handlers}>
                    <div className='footer-new_bottom-sheet'>
                        <div className='footer-new_bottom-sheet_payout'>
                            <div>Commission</div>
                            <div style={{ fontWeight: '700' }}>
                                0.10 USD{' '}
                                <Icon
                                    icon={show_purchase_details ? 'IcChevronDownBold' : 'IcChevronUpBold'}
                                    width={16}
                                    height={24}
                                    className='footer-new_bottom-sheet_payout_arrow'
                                    onClick={onPurchaseResult}
                                />
                            </div>
                        </div>
                        <CSSTransition
                            appear
                            classNames={{
                                appear: `footer-new_bottom-sheet_purchase-appear`,
                                appearDone: `footer-new_bottom-sheet_purchase-appear-done`,
                                enter: `footer-new_bottom-sheet_purchase-enter`,
                                enterDone: `footer-new_bottom-sheet_purchase-enter-done`,
                                exit: `footer-new_bottom-sheet_purchase-exit`,
                            }}
                            in={show_purchase_details}
                            timeout={300}
                            unmountOnExit
                        >
                            <div style={{ width: '100%' }} className='footer-new_bottom-sheet_purchase'>
                                <div className='footer-new_bottom-sheet_params-container'>
                                    <div className='footer-new_bottom-sheet_payout'>
                                        <div style={{ fontWeight: '700' }}>Parameter settings</div>
                                    </div>
                                    <div className='footer-new_bottom-sheet_payout'>
                                        <div
                                            style={{
                                                color: 'var(--core-color-opacity-black-400, rgba(0, 0, 0, 0.48))',
                                            }}
                                        >
                                            Contract type
                                        </div>
                                        <button
                                            className='footer-new_bottom-sheet_edit-button'
                                            onClick={e => {
                                                setSelectedType(!selected_left_type);
                                                e.stopPropagation();
                                            }}
                                        >
                                            <span>{selected_left_type ? 'Up' : 'Down'}</span>
                                            <Icon icon='IcNewPencil' height={22} width={14} />
                                        </button>
                                    </div>
                                    <div className='footer-new_bottom-sheet_payout'>
                                        <div
                                            style={{
                                                color: 'var(--core-color-opacity-black-400, rgba(0, 0, 0, 0.48))',
                                            }}
                                        >
                                            Multiplier
                                        </div>
                                        <button
                                            className='footer-new_bottom-sheet_edit-button'
                                            onClick={e => {
                                                setIsPortal(true);
                                                onTradeParamClickHandler('multiplier');
                                                e.stopPropagation();
                                            }}
                                        >
                                            <span>{valueGroups.multipliers}</span>
                                            <Icon icon='IcNewPencil' height={22} width={14} />
                                        </button>
                                    </div>
                                    <div className='footer-new_bottom-sheet_payout'>
                                        <div
                                            style={{
                                                color: 'var(--core-color-opacity-black-400, rgba(0, 0, 0, 0.48))',
                                            }}
                                        >
                                            Stake
                                        </div>
                                        <button
                                            className='footer-new_bottom-sheet_edit-button'
                                            onClick={e => {
                                                setIsPortal(true);
                                                onTradeParamClickHandler('stake');
                                                e.stopPropagation();
                                            }}
                                        >
                                            <span>10.00 USD</span>
                                            <Icon icon='IcNewPencil' height={22} width={14} />
                                        </button>
                                    </div>
                                    <div className='footer-new_bottom-sheet_payout'>
                                        <div
                                            style={{
                                                color: 'var(--core-color-opacity-black-400, rgba(0, 0, 0, 0.48))',
                                            }}
                                        >
                                            Risk Management
                                        </div>
                                        <button
                                            className='footer-new_bottom-sheet_edit-button'
                                            onClick={e => {
                                                setIsPortal(true);
                                                onTradeParamClickHandler('risk_management');
                                                e.stopPropagation();
                                            }}
                                        >
                                            <span>Take profit 1.00 USD </span>
                                            <Icon icon='IcNewPencil' height={22} width={14} />
                                        </button>
                                    </div>
                                    <div className='footer-new_bottom-sheet_payout'>
                                        <div
                                            style={{
                                                color: 'var(--core-color-opacity-black-400, rgba(0, 0, 0, 0.48))',
                                            }}
                                        >
                                            Risk Management
                                        </div>
                                        <button
                                            className='footer-new_bottom-sheet_edit-button'
                                            onClick={e => {
                                                setIsPortal(true);
                                                onTradeParamClickHandler('risk_management');
                                                e.stopPropagation();
                                            }}
                                        >
                                            <span>Take profit 1.00 USD </span>
                                            <Icon icon='IcNewPencil' height={22} width={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className='footer-new_bottom-sheet_params-total'>
                                    <div className='footer-new_bottom-sheet_payout'>
                                        <div style={{ fontSize: '16px' }}>Total cost</div>
                                        <div style={{ fontWeight: '700', fontSize: '16px' }}>10.00 USD </div>
                                    </div>
                                </div>
                            </div>
                        </CSSTransition>
                        <button
                            className={classNames('footer-new_bottom-sheet_button', {
                                'footer-new_bottom-sheet_button--red': !selected_left_type,
                            })}
                        >
                            Buy 10.00 USD
                        </button>
                    </div>
                    <NewFooterNavigation />
                </div>
            </div> */}
            <NewFooterNavigation />
        </React.Fragment>
    );
};

export default NewTrade;
