import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { VerticalTab, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import SearchInput from './search-input.jsx';
import NoResultsMessage from './no-results-message.jsx';
import { Header } from '../ContractTypeInfo';
import { getContractCategoryLabel } from '../../../../Helpers/contract-type';

const Dialog = ({
    categories,
    item,
    selected,
    children,
    is_info_dialog_open,
    is_open,
    onBackButtonClick,
    onCategoryClick,
    onChangeInput,
}) => {
    const input_ref = React.useRef(null);

    const [input_value, setInputValue] = React.useState('');

    const contract_category = getContractCategoryLabel(categories, item);
    const selected_item = selected ? { label: selected } : contract_category;
    const selected_category_contract = !categories?.find(category => category.label === selected_item.label)
        ?.contract_categories.length;

    const onChange = e => {
        if (is_info_dialog_open) {
            onBackButtonClick();
        }
        if (input_value) {
            onClickClearInput();
        }
        if (onCategoryClick) {
            onCategoryClick(e);
        }
    };

    const onChangeInputValue = e => {
        setInputValue(e.target.value);
        onChangeInput(e.target.value);
    };

    const onClickClearInput = () => {
        input_ref.current.focus();
        setInputValue('');
        onChangeInput('');
    };

    const action_bar_items = is_info_dialog_open ? (
        <Header title={item.text} onClickGoBack={onBackButtonClick} />
    ) : (
        <SearchInput
            ref={input_ref}
            onChange={onChangeInputValue}
            onClickClearInput={onClickClearInput}
            value={input_value}
        />
    );

    return (
        <CSSTransition
            in={is_open}
            timeout={100}
            classNames={{
                enter: 'contract-type-dialog--enter',
                enterDone: 'contract-type-dialog--enterDone',
                exit: 'contract-type-dialog--exit',
            }}
            unmountOnExit
        >
            <div className='contract-type-dialog' data-testid='contract_wrapper'>
                <div className='contract-type-dialog__wrapper'>
                    <VerticalTab.Layout>
                        <VerticalTab.Headers
                            header_title={localize('Trade types')}
                            items={categories}
                            selected={selected_item}
                            onChange={onChange}
                        />
                        <div className='dc-vertical-tab__content'>
                            <div className='dc-vertical-tab__action-bar'>{action_bar_items}</div>
                            <div className='dc-vertical-tab__content-container'>
                                {selected_category_contract && <NoResultsMessage text={input_value} />}
                                {!is_info_dialog_open ? (
                                    <ThemedScrollbars height='calc(100vh - 172px)'>{children}</ThemedScrollbars>
                                ) : (
                                    children
                                )}
                            </div>
                        </div>
                    </VerticalTab.Layout>
                </div>
            </div>
        </CSSTransition>
    );
};

Dialog.propTypes = {
    is_info_dialog_open: PropTypes.bool,
    is_open: PropTypes.bool,
    item: PropTypes.object,
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onBackButtonClick: PropTypes.func,
    onChangeInput: PropTypes.func,
};

export default Dialog;
