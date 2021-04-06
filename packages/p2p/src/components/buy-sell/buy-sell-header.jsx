import PropTypes from 'prop-types';
import React from 'react';
import { ButtonToggle } from '@deriv/components';
import { buy_sell } from 'Constants/buy-sell';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/misc/toggle-container.jsx';
import AnimationWrapper from 'Components/misc/animation-wrapper.jsx';
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
