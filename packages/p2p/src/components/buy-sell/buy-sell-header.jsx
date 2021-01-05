import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { ButtonToggle } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { buy_sell } from 'Constants/buy-sell';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/misc/toggle-container.jsx';
import 'Components/buy-sell/buy-sell-header.scss';

const getBuySellFilters = () => [
    {
        text: localize('Buy'),
        value: buy_sell.BUY,
    },
    {
        text: localize('Sell'),
        value: buy_sell.SELL,
    },
];

const AnimationWrapper = ({ children, is_visible }) => {
    if (isMobile()) {
        return (
            <CSSTransition in={is_visible} timeout={250} classNames='buy-sell__header-animation'>
                {children}
            </CSSTransition>
        );
    }

    return children;
};

const BuySellHeader = ({ is_visible, table_type, setTableType }) => {
    const onChangeTableType = event => setTableType(event.target.value);

    return (
        <AnimationWrapper is_visible={is_visible}>
            <div className='buy-sell__header'>
                <ToggleContainer>
                    <ButtonToggle
                        buttons_arr={getBuySellFilters()}
                        className='buy-sell__header-filters'
                        is_animated
                        name='filter'
                        onChange={onChangeTableType}
                        value={table_type}
                        has_rounded_button
                    />
                </ToggleContainer>
            </div>
        </AnimationWrapper>
    );
};

BuySellHeader.propTypes = {
    table_type: PropTypes.string,
    setTableType: PropTypes.func,
};

export default BuySellHeader;
