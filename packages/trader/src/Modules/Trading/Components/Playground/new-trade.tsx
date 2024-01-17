import React from 'react';
import { Icon, Carousel } from '@deriv/components';
import NewTradeTypeWidget from './new-trade-type-widget';
// import NewChartDropdown from './new-chart-dropdown';
import NewTradeParamsContainer from './new-trade-params-container';
import NewTradeParamPopup from './new-trade-param-popup';

const NewTrade = () => {
    const [show_details, setShowDetails] = React.useState(false);

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
                        <NewTradeParamsContainer onClick={() => setShowDetails(!show_details)} key={1} />,
                        <div key={2}>Hello, I&apos;m not ready</div>,
                    ]}
                    nav_position='bottom'
                    bullet_position='bottom'
                    show_nav={false}
                    width={100}
                />
            </div>
            {show_details && (
                <NewTradeParamPopup
                    onClick={() => {
                        setShowDetails(!show_details);
                    }}
                    // show_details={show_details}
                />
            )}
            <div className='footer-new'>
                <div className='footer-new_bottom-sheet'>
                    <div className='footer-new_bottom-sheet_payout'>
                        <div>Expected payout</div>
                        <div style={{ fontWeight: '700' }}>
                            19.57 USD{' '}
                            <Icon
                                icon='IcChevronUpBold'
                                width={16}
                                height={24}
                                className='footer-new_bottom-sheet_payout_arrow'
                            />
                        </div>
                    </div>
                    <button className='footer-new_bottom-sheet_button'>Buy 10.00 USD</button>
                </div>
                <div className='footer-new_navigation'>
                    <div className='footer-new_navigation_icon footer-new_navigation_icon-selected'>Icon 1</div>
                    <div className='footer-new_navigation_icon'>Icon 2</div>
                    <div className='footer-new_navigation_icon'>Icon 3</div>
                    <div className='footer-new_navigation_icon'>Icon 4</div>
                    <div className='footer-new_navigation_icon'>Icon 5</div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default NewTrade;
