import classNames from 'classnames';
import React      from 'react';
import { Icon }   from '@deriv/components';

const ContractTypeInfoNav = ({
    list,
    selected_item_index,
    handleNavigationClick,
}) => {
    const handleNextClick = () => {
        const next_idx       = selected_item_index + 1;
        const is_reached_end = next_idx === list.length;

        if (!is_reached_end) {
            handleNavigationClick(list[next_idx]);
        } else {
            handleNavigationClick(list[0]);
        }
    };

    const handlePrevClick = () => {
        const prev_idx = selected_item_index - 1;

        if (prev_idx > -1) {
            handleNavigationClick(list[prev_idx]);
        } else {
            handleNavigationClick(list[list.length - 1]);
        }
    };

    return (
        <div className='contract-type-info-navigation'>
            <div
                id='dt_contract_info_left_nav'
                className='contract-type-info-navigation__icon'
                onClick={handlePrevClick}
            >
                <Icon icon='IcChevronLeft' />
            </div>
            <div className='contract-type-info-navigation__list'>
                <i
                    className={classNames(
                        'contract-type-info-navigation__circle-button',
                        'contract-type-info-navigation__circle-button--active')}
                    style={{ 'transform': `translate3d(${16 * selected_item_index}px, 0, 0)` }}
                />
                {
                    list.map((contract, idx) => (
                        <div
                            id={`dt_contract_info_${contract.value}_circle`}
                            key={idx}
                            className='contract-type-info-navigation__circle-button'
                            onClick={() => handleNavigationClick(contract)}
                        />
                    ))
                }
            </div>
            <div
                id='dt_contract_info_right_nav'
                className='contract-type-info-navigation__icon'
                onClick={handleNextClick}
            >
                <Icon icon='IcChevronRight' />
            </div>
        </div>
    );
};

export default React.memo(ContractTypeInfoNav);
