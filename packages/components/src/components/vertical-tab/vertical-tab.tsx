import React from 'react';
import classNames from 'classnames';
import { matchRoute } from '@deriv/shared';
import VerticalTabContentContainer, { TAction_bar } from './vertical-tab-content-container';
import VerticalTabHeader, { TItem } from './vertical-tab-header';
import VerticalTabHeaderGroup from './vertical-tab-header-group';
import VerticalTabHeaders from './vertical-tab-headers';
import VerticalTabHeaderTitle from './vertical-tab-header-title';
import VerticalTabLayout from './vertical-tab-layout';
import VerticalTabWrapper from './vertical-tab-wrapper';
import Icon from '../icon/icon';

type TSetSelectedIndex = {
    current_path: string;
    list: TItem[];
    is_routed?: boolean;
    selected_index?: number | TItem;
    setCurrTabIndex: (index: number) => void;
    setVerticalTabIndex?: (index: number) => void;
};

type TVerticalTab = {
    action_bar?: TAction_bar[];
    action_bar_classname?: string;
    className?: string;
    current_path: string;
    extra_content?: React.ReactNode | React.ReactNode[];
    extra_offset?: number;
    has_mixed_dimensions?: boolean;
    header_classname?: string;
    header_title?: string;
    is_collapsible?: boolean;
    is_floating?: boolean;
    is_grid?: boolean;
    is_full_width?: boolean;
    is_routed?: boolean;
    is_sidebar_enabled?: boolean;
    list: TItem[];
    list_groups?: TItem[];
    onClickClose?: () => void;
    setVerticalTabIndex?: (index: number) => void;
    tab_headers_note: React.ReactNode | React.ReactNode[];
    title?: string;
    vertical_tab_index?: number;
};

const setSelectedIndex = ({
    current_path,
    list,
    is_routed,
    selected_index,
    setCurrTabIndex,
    setVerticalTabIndex,
}: TSetSelectedIndex) => {
    let index: number;

    if (typeof selected_index === 'undefined') {
        index = is_routed
            ? Math.max(
                  list.indexOf(
                      (list.find(item => matchRoute(item, current_path)) || list.find(item => item.default)) as TItem
                  ),
                  0
              )
            : 0;
    } else {
        index = typeof selected_index === 'object' ? list.indexOf(selected_index) : selected_index;
    }

    setCurrTabIndex(index);
    setVerticalTabIndex?.(index);
};

const VerticalTab = ({
    action_bar,
    action_bar_classname,
    className,
    current_path,
    extra_content,
    extra_offset,
    has_mixed_dimensions,
    header_classname,
    header_title,
    is_collapsible,
    is_floating,
    is_grid,
    is_full_width,
    is_routed,
    is_sidebar_enabled = true,
    list,
    list_groups,
    onClickClose,
    setVerticalTabIndex,
    tab_headers_note,
    title,
    vertical_tab_index,
}: TVerticalTab) => {
    const [curr_tab_index, setCurrTabIndex] = React.useState(vertical_tab_index || 0);

    const changeSelected = (e: TItem) => {
        setSelectedIndex({
            current_path,
            list,
            selected_index: e,
            setCurrTabIndex,
            setVerticalTabIndex,
        });
    };

    React.useEffect(() => {
        setSelectedIndex({
            current_path,
            list,
            is_routed,
            setCurrTabIndex,
            setVerticalTabIndex,
        });
    }, [vertical_tab_index, list, setVerticalTabIndex, is_routed, current_path]);

    return (
        <div
            className={classNames('dc-vertical-tab', {
                'dc-vertical-tab--floating': is_floating, // This is currently only configured for use in PageOverlay
                'dc-vertical-tab--full-screen': is_full_width,
                'dc-vertical-tab--grouped': Array.isArray(list_groups),
                'dc-vertical-tab--grid': is_grid,
                [`dc-vertical-tab--${className}`]: className,
            })}
        >
            {!!title && (
                <div className='dc-vertical-tab__title'>
                    <div className='dc-vertical-tab__title-wrapper'>
                        <div className='dc-vertical-tab__title-text'>{title}</div>
                        {onClickClose && (
                            <div className='dc-vertical-tab__title-close' onClick={onClickClose || window.history.back}>
                                <Icon icon='IcCross' />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {is_sidebar_enabled && (
                <div
                    className={classNames('dc-vertical-tab__tab-meta-wrapper', {
                        'dc-vertical-tab__tab-meta-wrapper--floating': is_floating,
                        [`dc-vertical-tab__tab-meta-wrapper--${className}`]: className,
                    })}
                >
                    <VerticalTabHeaders
                        className={header_classname}
                        extra_offset={extra_offset}
                        items={list}
                        item_groups={list_groups}
                        onChange={changeSelected}
                        selected={list[curr_tab_index] || list[0]}
                        has_mixed_dimensions={has_mixed_dimensions}
                        is_collapsible={is_collapsible}
                        is_floating={is_floating}
                        is_routed={is_routed}
                        header_title={header_title}
                    />
                    {is_floating && tab_headers_note && (
                        <div className='dc-vertical-tab__tab-bottom-note'>{tab_headers_note}</div>
                    )}
                    {extra_content}
                </div>
            )}
            <VerticalTabContentContainer
                action_bar={action_bar}
                action_bar_classname={action_bar_classname}
                className={className}
                is_floating={is_floating}
                items={list}
                selected={list[curr_tab_index] || list[0]}
                is_routed={is_routed}
            />
        </div>
    );
};

VerticalTab.ContentContainer = VerticalTabContentContainer;
VerticalTab.Header = VerticalTabHeader;
VerticalTab.HeaderGroup = VerticalTabHeaderGroup;
VerticalTab.Headers = VerticalTabHeaders;
VerticalTab.HeaderTitle = VerticalTabHeaderTitle;
VerticalTab.Layout = VerticalTabLayout;
VerticalTab.Wrapper = VerticalTabWrapper;

export default VerticalTab;
