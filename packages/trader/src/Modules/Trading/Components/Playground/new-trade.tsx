import React from 'react';
import classNames from 'classnames';
import { Icon, Carousel } from '@deriv/components';
import NewTradeTypeWidget from './new-trade-type-widget';
import NewTradeParamsContainer from './new-trade-params-container';
import NewTradeParamPopupWrapper from './new-trade-param-popup-wrapper';

const NewTrade = () => {
    const [show_details, setShowDetails] = React.useState(false);
    const [is_risk_management, setIsRiskManagement] = React.useState(false);
    const [is_stake, setIsStake] = React.useState(false);
    const [selected_left_type, setSelectedType] = React.useState(true);

    const ClickHandler = (trade_param: string) => {
        setIsRiskManagement(false);
        setIsStake(false);

        if (trade_param === 'risk_management') setIsRiskManagement(true);
        if (trade_param === 'stake') setIsStake(true);

        setShowDetails(true);
    };

    return (
        <React.Fragment>
            <div className='content_container'>
                <NewTradeTypeWidget />
                <Carousel
                    className='my-slider__wrapper'
                    initial_index={0}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onItemSelect={() => {}}
                    list={[
                        <NewTradeParamsContainer
                            onClick={ClickHandler}
                            key={1}
                            setSelectedType={setSelectedType}
                            selected_left_type={selected_left_type}
                        />,
                        <div key={2} style={{ marginTop: '-0.5rem' }}>
                            <Icon icon='IcNewChart' className='new-chart-icon' />
                        </div>,
                    ]}
                    nav_position='bottom'
                    bullet_position='bottom'
                    show_nav={false}
                    width={100}
                />
            </div>
            <NewTradeParamPopupWrapper
                onClick={() => {
                    setShowDetails(false);
                }}
                show_details={show_details}
                is_risk_management={is_risk_management}
                is_stake={is_stake}
            />
            <div className='footer-new'>
                <div className='footer-new_bottom-sheet'>
                    <div className='footer-new_bottom-sheet_payout'>
                        <div>Commission</div>
                        <div style={{ fontWeight: '700' }}>
                            0.10 USD{' '}
                            <Icon
                                icon='IcChevronUpBold'
                                width={16}
                                height={24}
                                className='footer-new_bottom-sheet_payout_arrow'
                            />
                        </div>
                    </div>
                    <button
                        className={classNames('footer-new_bottom-sheet_button', {
                            'footer-new_bottom-sheet_button--red': !selected_left_type,
                        })}
                    >
                        Buy 10.00 USD
                    </button>
                </div>
                <div className='footer-new_navigation'>
                    <div className='footer-new_navigation_icon footer-new_navigation_icon-selected'>
                        <Icon icon='IcNewTradeMenu' size={24} />
                    </div>
                    <div className='footer-new_navigation_icon'>
                        <Icon icon='IcNewBasket' size={24} />
                    </div>
                    <div className='footer-new_navigation_icon'>
                        <Icon icon='IcNewClock' size={24} />
                    </div>
                    <div className='footer-new_navigation_icon'>
                        <Icon icon='IcNewLearn' size={24} />
                    </div>
                    <div className='footer-new_navigation_icon'>
                        <Icon icon='IcNewMenu' size={24} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default NewTrade;
