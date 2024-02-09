import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Loading, ThemedScrollbars, VerticalTab } from '@deriv/components';
import { localize } from '@deriv/translations';
import SearchInput from './search-input';
import NoResultsMessage from './no-results-message';
import { Header } from '../ContractTypeInfo/index';
import { getContractCategoryKey } from '../../../../Helpers/contract-type';
import { TList } from '../types';
import ContractType from '../contract-type';

type TDialog = {
    categories: TList[];
    info_banner?: React.ReactNode;
    item: React.ComponentProps<typeof ContractType.Info>['item'];
    selected?: string;
    children?: React.ReactNode;
    is_info_dialog_open?: boolean;
    is_open?: boolean;
    onBackButtonClick?: () => void;
    onCategoryClick?: (e: React.ComponentProps<typeof VerticalTab.Headers>['selected']) => void;
    onChangeInput?: (e: string) => void;
    onSearchBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement | null>;
    onClose?: () => void;
    show_loading?: boolean;
    learn_more_banner?: React.ReactNode;
    hide_back_button?: boolean;
    title?: string;
};

const Dialog = ({
    categories,
    children,
    info_banner,
    is_info_dialog_open,
    is_open,
    item,
    onBackButtonClick,
    onCategoryClick,
    onChangeInput,
    onSearchBlur,
    onClose,
    selected,
    show_loading,
    learn_more_banner,
    hide_back_button,
    title,
}: React.PropsWithChildren<TDialog>) => {
    const input_ref = React.useRef<(HTMLInputElement & HTMLTextAreaElement) | null>(null);
    const [input_value, setInputValue] = React.useState('');
    const contract_category = getContractCategoryKey(categories, item);
    const selected_item = selected ? { key: selected } : { key: contract_category };
    const selected_category_contract = !categories?.find(category => category.key === selected_item.key)
        ?.contract_categories?.length;
    const onChange: React.ComponentProps<typeof VerticalTab.Headers>['onChange'] = e => {
        if (is_info_dialog_open) {
            onBackButtonClick?.();
        }
        if (input_value) {
            onClickClearInput();
        }
        if (onCategoryClick) {
            onCategoryClick(e);
        }
    };

    const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChangeInput?.(e.target.value);
    };

    const onClickClearInput = () => {
        input_ref?.current?.focus();
        setInputValue('');
        onChangeInput?.('');
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
            onBlur={onSearchBlur}
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
                                            {info_banner}
                                            {learn_more_banner}
                                            {renderChildren()}
                                        </div>
                                    </div>
                                </VerticalTab.Layout>
                            ) : (
                                <React.Fragment>
                                    <div className='dc-vertical-tab__action-bar dc-vertical-tab__action-bar--contract-type-info-header'>
                                        <Header
                                            title={title || item.text || ''}
                                            onClickBack={onBackButtonClick}
                                            onClose={onClose}
                                            should_render_arrow={!hide_back_button}
                                            should_render_close={hide_back_button}
                                        />
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

export default Dialog;
