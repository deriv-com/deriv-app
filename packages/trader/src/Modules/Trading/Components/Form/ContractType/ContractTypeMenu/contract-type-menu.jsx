import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Loading, ThemedScrollbars, VerticalTab } from '@deriv/components';
import { localize } from '@deriv/translations';
import SearchInput from './search-input.jsx';
import NoResultsMessage from './no-results-message.jsx';
import { Header } from '../ContractTypeInfo';
import { getContractCategoryKey } from '../../../../Helpers/contract-type';

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
    show_loading,
}) => {
    const input_ref = React.useRef(null);

    const [input_value, setInputValue] = React.useState('');

    const contract_category = getContractCategoryKey(categories, item);
    const selected_item = selected ? { key: selected } : contract_category;
    const selected_category_contract = !categories?.find(category => category.key === selected_item.key)
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

    const renderChildren = () => {
        if (!is_info_dialog_open) {
            return <ThemedScrollbars height='calc(100vh - 172px)'>{children}</ThemedScrollbars>;
        }
        return children;
    };
    const action_bar_item = (
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
            <div className='contract-type-dialog' data-testid='dt_contract_wrapper'>
                <div className='contract-type-dialog__wrapper'>
                    {show_loading ? (
                        <Loading is_fullscreen={false} />
                    ) : (
                        <React.Fragment>
                            {!is_info_dialog_open ? (
                                <VerticalTab.Layout>
                                    <VerticalTab.Headers
                                        header_title={localize('Trade types')}
                                        items={categories}
                                        selected={selected_item}
                                        onChange={onChange}
                                        selectedKey='key'
                                    />

                                    <div className='dc-vertical-tab__content'>
                                        <div className='dc-vertical-tab__action-bar'>{action_bar_item}</div>
                                        <div className='dc-vertical-tab__content-container'>
                                            {selected_category_contract && <NoResultsMessage text={input_value} />}
                                            {renderChildren()}
                                        </div>
                                    </div>
                                </VerticalTab.Layout>
                            ) : (
                                <React.Fragment>
                                    <div className='dc-vertical-tab__action-bar dc-vertical-tab__action-bar--contract-type-info-header'>
                                        <Header title={item.text} onClickGoBack={onBackButtonClick} />
                                    </div>
                                    {renderChildren()}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
        </CSSTransition>
    );
};

Dialog.propTypes = {
    categories: PropTypes.array,
    children: PropTypes.node,
    is_info_dialog_open: PropTypes.bool,
    is_open: PropTypes.bool,
    selected: PropTypes.string,
    show_loading: PropTypes.bool,
    item: PropTypes.object,
    list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onBackButtonClick: PropTypes.func,
    onCategoryClick: PropTypes.func,
    onChangeInput: PropTypes.func,
};

export default Dialog;
