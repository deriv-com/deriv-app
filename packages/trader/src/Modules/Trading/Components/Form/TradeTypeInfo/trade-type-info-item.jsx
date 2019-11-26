import classNames      from 'classnames';
import PropTypes       from 'prop-types';
import React           from 'react';
import {
    Button,
    ThemedScrollbars } from 'deriv-components';
import Icon            from 'Assets/icon.jsx';
import { localize }    from 'deriv-translations';

const TradeTypeInfoItem = ({
    handleNavigationClick,
    handleNextClick,
    handlePrevClick,
    is_dark_theme,
    is_mobile,
    item,
    item_index,
    itemList,
    itemListLength,
    onBackButtonClick,
    onSubmitButtonClick,
}) => (
    <div id={`dt_contract_info_${item.value}`}>
        {!is_mobile &&
        <div className='trade-type-info-dialog__header'>
            <span id='dt_contract_info_back_nav' onClick={() => onBackButtonClick()}>
                <Icon icon='IconBack' />
            </span>
            <span className='title'>{item.text}</span>
        </div>
        }
        <div className='trade-type-info-dialog__body'>
            <div
                className='trade-type-info-dialog__card-wrapper'
                // total calculated below is from 258px and 16px horizontal margin set in trade-info-dialog css
                style={{ 'transform': `translate3d(-${(274 * item_index)}px, 0, 0)`  }}
            >
                {
                    itemList.map((type, idx) => (
                        <div className='trade-type-info-dialog__card' key={idx}>
                            <div className='trade-type-info-dialog__gif'>
                                <Icon
                                    icon='TradeCategoriesGIF'
                                    category={type.value}
                                    className='trade-type-info-dialog__gif-image'
                                    is_dark_theme={is_dark_theme}
                                />
                            </div>
                            <div className='trade-type-info-dialog__content'>
                                <ThemedScrollbars
                                    autoHide
                                    style={{ height: '100%' }}
                                >
                                    <Icon icon='TradeCategories' category={type.value} />
                                </ThemedScrollbars>
                            </div>
                            {itemListLength > 1 &&
                            <div>
                                <Button
                                    id={`dt_contract_info_${item.value}_button`}
                                    className='trade-type-info-dialog__choose-button'
                                    onClick={() => onSubmitButtonClick(type)}
                                    text={localize('Choose {{trade_type}}', { trade_type: item.text, interpolation: { escapeValue: false } })}
                                    secondary
                                />
                            </div>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
        {itemListLength > 1 &&
        <div className='trade-type-info-navigation'>
            <div id='dt_contract_info_left_nav' className='trade-type-info-navigation__icon' onClick={() => handlePrevClick(itemList)} >
                <Icon icon='IconChevronLeft' />
            </div>
            <div className='trade-type-info-navigation__list'>
                <i
                    className={classNames(
                        'trade-type-info-navigation__circle-button',
                        'trade-type-info-navigation__circle-button--active')}
                    style={{ 'transform': `translate3d(${16 * item_index}px, 0, 0)` }}
                />
                {
                    itemList.map((contract, idx) => (
                        <React.Fragment key={idx}>
                            <div
                                id={`dt_contract_info_${contract.value}_circle`}
                                className='trade-type-info-navigation__circle-button'
                                onClick={() => handleNavigationClick(contract)}
                            />
                        </React.Fragment>
                    ))
                }
            </div>
            <div id='dt_contract_info_right_nav' className='trade-type-info-navigation__icon' onClick={() => handleNextClick(itemList)} >
                <Icon icon='IconChevronRight' />
            </div>
        </div>
        }
    </div>
);

TradeTypeInfoItem.propTypes = {
    handleNavigationClick: PropTypes.func,
    handleNextClick      : PropTypes.func,
    handlePrevClick      : PropTypes.func,
    is_dark_theme        : PropTypes.bool,
    is_mobile            : PropTypes.bool,
    item                 : PropTypes.object,
    item_index           : PropTypes.number,
    itemList             : PropTypes.array,
    onBackButtonClick    : PropTypes.func,
    onSubmitButtonClick  : PropTypes.func,
};

export default TradeTypeInfoItem;
