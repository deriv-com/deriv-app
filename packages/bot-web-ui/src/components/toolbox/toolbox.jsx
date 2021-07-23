import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field as FormField, Formik, Form } from 'formik';
import { Drawer, Input, Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { ToolboxItems } from './toolbox-items.jsx';
import { connect } from '../../stores/connect';
import { popover_zindex } from '../../constants/z-indexes';

const SearchBox = ({ is_search_loading, onSearch, onSearchBlur, onSearchClear, onSearchKeyUp }) => (
    <div className='db-toolbox__search'>
        <Formik initialValues={{ search: '' }} onSubmit={onSearch}>
            {({ submitForm, values: { search }, setFieldValue }) => (
                <Form>
                    <FormField name='search'>
                        {({ field }) => (
                            <Input
                                {...field}
                                className='db-toolbox__search-field'
                                type='text'
                                name='search'
                                placeholder={localize('Search')}
                                onKeyUp={() => onSearchKeyUp(submitForm)}
                                onFocus={submitForm}
                                onBlur={onSearchBlur}
                                leading_icon={
                                    (search &&
                                        (is_search_loading ? (
                                            <div className='loader' />
                                        ) : (
                                            <Icon
                                                icon='IcCloseCircle'
                                                onClick={() => onSearchClear(setFieldValue)}
                                                color='secondary'
                                            />
                                        ))) ||
                                    (!search && <Icon icon='IcSearch' />)
                                }
                            />
                        )}
                    </FormField>
                </Form>
            )}
        </Formik>
    </div>
);

const Toolbox = ({
    onMount,
    onUnmount,
    hasSubCategory,
    is_mobile,
    is_search_loading,
    is_toolbox_open,
    onSearch,
    onSearchBlur,
    onSearchClear,
    onSearchKeyUp,
    onToolboxItemClick,
    onToolboxItemExpand,
    sub_category_index,
    toggleDrawer,
    toolbox_dom,
}) => {
    const toolbox_ref = React.useRef(ToolboxItems);

    React.useEffect(() => {
        onMount(toolbox_ref);
        return () => onUnmount();
    }, [onMount, onUnmount]);

    if (is_mobile) {
        return null;
    }

    return (
        <Drawer
            anchor='left'
            className='db-toolbox'
            is_open={is_toolbox_open}
            toggleDrawer={toggleDrawer}
            width={256}
            zIndex={popover_zindex.RUN_PANEL}
        >
            <div id='gtm-toolbox' className='db-toolbox__content'>
                <div className='db-toolbox__header'>
                    <div className='db-toolbox__title'>{localize('Blocks menu')}</div>
                </div>
                <SearchBox
                    is_search_loading={is_search_loading}
                    onSearch={onSearch}
                    onSearchBlur={onSearchBlur}
                    onSearchClear={onSearchClear}
                    onSearchKeyUp={onSearchKeyUp}
                />
                <div className='db-toolbox__category-menu'>
                    {toolbox_dom &&
                        // eslint-disable-next-line consistent-return
                        Array.from(toolbox_dom.childNodes).map((category, index) => {
                            if (category.tagName.toUpperCase() === 'CATEGORY') {
                                const has_sub_category = hasSubCategory(category.children);
                                const is_sub_category_open = sub_category_index.includes(index);
                                return (
                                    <div
                                        key={`db-toolbox__row--${category.getAttribute('id')}`}
                                        className='db-toolbox__row'
                                    >
                                        <div
                                            className='db-toolbox__item'
                                            onClick={() => {
                                                // eslint-disable-next-line no-unused-expressions
                                                has_sub_category
                                                    ? onToolboxItemExpand(index)
                                                    : onToolboxItemClick(category);
                                            }}
                                        >
                                            <div className='db-toolbox__category-text'>
                                                <div className='db-toolbox__label'>
                                                    {localize(category.getAttribute('name'))}
                                                </div>
                                                {has_sub_category && (
                                                    <div
                                                        className={classNames('db-toolbox__category-arrow', {
                                                            'db-toolbox__category-arrow--active': is_sub_category_open,
                                                        })}
                                                    >
                                                        <Icon icon='IcChevronDownBold' />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {has_sub_category &&
                                            is_sub_category_open &&
                                            Array.from(category.childNodes).map(subCategory => {
                                                return (
                                                    <div
                                                        key={`db-toolbox__sub-category-row--${subCategory.getAttribute(
                                                            'id'
                                                        )}`}
                                                        className='db-toolbox__sub-category-row'
                                                        onClick={() => {
                                                            onToolboxItemClick(subCategory);
                                                        }}
                                                    >
                                                        <Text size='xxs' line_height='m'>
                                                            {localize(subCategory.getAttribute('name'))}
                                                        </Text>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                );
                            }
                        })}
                </div>
            </div>
        </Drawer>
    );
};

Toolbox.PropTypes = {
    hasSubCategory: PropTypes.func,
    is_mobile: PropTypes.bool,
    is_search_loading: PropTypes.bool,
    is_toolbox_open: PropTypes.bool,
    onMount: PropTypes.func,
    onSearch: PropTypes.func,
    onSearchBlur: PropTypes.func,
    onSearchClear: PropTypes.func,
    onSearchKeyUp: PropTypes.func,
    onToolboxItemClick: PropTypes.func,
    onToolboxItemExpand: PropTypes.func,
    onUnmount: PropTypes.func,
    sub_category_index: PropTypes.array,
    toggleDrawer: PropTypes.func,
    toolbox_dom: PropTypes.arrayOf(NodeList),
};

export default connect(({ toolbox, ui }) => ({
    hasSubCategory: toolbox.hasSubCategory,
    is_mobile: ui.is_mobile,
    is_search_loading: toolbox.is_search_loading,
    is_toolbox_open: toolbox.is_toolbox_open,
    onMount: toolbox.onMount,
    onSearch: toolbox.onSearch,
    onSearchBlur: toolbox.onSearchBlur,
    onSearchClear: toolbox.onSearchClear,
    onSearchKeyUp: toolbox.onSearchKeyUp,
    onToolboxItemClick: toolbox.onToolboxItemClick,
    onToolboxItemExpand: toolbox.onToolboxItemExpand,
    onUnmount: toolbox.onUnmount,
    sub_category_index: toolbox.sub_category_index,
    toggleDrawer: toolbox.toggleDrawer,
    toolbox_dom: toolbox.toolbox_dom,
}))(Toolbox);
