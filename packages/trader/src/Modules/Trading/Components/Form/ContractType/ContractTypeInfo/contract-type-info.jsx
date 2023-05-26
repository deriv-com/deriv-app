import PropTypes from 'prop-types';
import React from 'react';
import { Button, ThemedScrollbars, Carousel, ButtonToggle } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import TradeCategories from 'Assets/Trading/Categories/trade-categories.jsx';
import TradeCategoriesGIF from 'Assets/Trading/Categories/trade-categories-gif.jsx';
import { getContractTypes } from '../../../../Helpers/contract-type';
import ContractTypeGlossary from './contract-type-glossary.jsx';
import classNames from 'classnames';

const Info = ({ handleNavigationClick, handleSelect, initial_index, item, list }) => {
    const [carousel_index, setCarouselIndex] = React.useState(initial_index);
    const [selected_tab, setSelectedTab] = React.useState('description');
    const width = isMobile() ? '328' : '528';
    const contract_types = getContractTypes(list, item).filter(i => i.value !== 'rise_fall_equal');
    const onClickGlossary = () => setSelectedTab('glossary');
    const has_toggle_buttons = carousel_index !== 8 && carousel_index !== 1;
    const cards = contract_types.map((type, idx) => {
        return (
            <div
                key={idx}
                className={classNames('contract-type-info__card', {
                    'contract-type-info__card--has-toggle-buttons': !has_toggle_buttons,
                })}
            >
                {selected_tab === 'description' ? (
                    <ThemedScrollbars
                        className={classNames('contract-type-info__scrollbars', {
                            'contract-type-info__scrollbars-description--active': selected_tab === 'description',
                        })}
                        style={{ left: `-${width}px`, transform: `translate3d(${width}px, 0, 0)` }}
                        height={isMobile() ? '' : '510px'}
                        autohide={false}
                    >
                        <div
                            className={classNames('contract-type-info__gif', {
                                'contract-type-info__gif--has-toggle-buttons': has_toggle_buttons,
                            })}
                        >
                            <TradeCategoriesGIF category={type.value} />
                        </div>
                        <div className='contract-type-info__content'>
                            <TradeCategories category={type.value} onClick={onClickGlossary} />
                        </div>
                    </ThemedScrollbars>
                ) : (
                    <ThemedScrollbars
                        className={classNames(
                            'contract-type-info__scrollbars contract-type-info__scrollbars-glossary',
                            {
                                'contract-type-info__scrollbars-glossary--active': selected_tab === 'glossary',
                            }
                        )}
                        style={{ left: `${width}px`, transform: `translate3d(-${width}px, 0, 0)` }}
                        height={isMobile() ? '' : '440px'}
                        autohide={false}
                    >
                        <div className='contract-type-info__content contract-type-info__content-glossary'>
                            <ContractTypeGlossary category={type.value} />
                        </div>
                    </ThemedScrollbars>
                )}
                <Button
                    id={`dt_contract_info_${type.value}_btn`}
                    className='contract-type-info__button'
                    onClick={e => handleSelect(type, e)}
                    text={localize('Choose {{contract_type}}', {
                        contract_type: type.text,
                        interpolation: { escapeValue: false },
                    })}
                    secondary
                />
            </div>
        );
    });

    return (
        <React.Fragment>
            {!has_toggle_buttons && (
                <div className='contract-type-info__button-wrapper'>
                    <ButtonToggle
                        buttons_arr={[
                            { text: localize('Description'), value: 'description' },
                            { text: localize('Glossary'), value: 'glossary' },
                        ]}
                        name='description_glossary_filter'
                        is_animated
                        has_rounded_button
                        onChange={e => {
                            setSelectedTab(e.target.value);
                        }}
                        value={selected_tab}
                    />
                </div>
            )}
            <Carousel
                className='contract-type-info'
                bullet_color='var(--text-disabled)'
                active_bullet_color='var(--brand-red-coral)'
                initial_index={carousel_index}
                onItemSelect={active_index => {
                    setCarouselIndex(active_index);
                    handleNavigationClick(contract_types[active_index]);
                    if (has_toggle_buttons && selected_tab === 'glossary') {
                        setSelectedTab('description');
                    }
                }}
                list={cards}
                width={isMobile() ? 328 : 528}
            />
        </React.Fragment>
    );
};

Info.propTypes = {
    handleSelect: PropTypes.func,
    initial_index: PropTypes.number,
    item: PropTypes.object,
    list: PropTypes.array,
    handleNavigationClick: PropTypes.func,
};

export default Info;
