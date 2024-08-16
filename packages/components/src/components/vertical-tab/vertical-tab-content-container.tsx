import classNames from 'classnames';
import React, { memo, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import Icon from '../icon/icon';
import { TItem } from './vertical-tab-header';

type TSideNotes = {
    class_name?: string;
    side_notes: React.ReactNode[] | null;
};

type TContent = {
    is_routed?: boolean;
    items: TItem[];
    selected: TItem;
};

export type TAction_bar = {
    component?: typeof React.Component;
    onClick?: () => void;
    icon: string;
    title?: string;
};

type TVerticalTabContentContainer = TContent & {
    action_bar?: TAction_bar[];
    action_bar_classname?: string;
    className?: string;
    id?: string;
    is_floating?: boolean;
    tab_container_classname?: string;
};

const SideNotes = ({ class_name, side_notes }: TSideNotes) => {
    return (
        <div
            className={classNames('dc-vertical-tab__content-side-note', { [class_name as string]: !!side_notes })}
            data-testid='vertical_tab_side_note'
        >
            {side_notes?.map((note, i) => (
                <div className='dc-vertical-tab__content-side-note-item' key={i}>
                    {note}
                </div>
            ))}
        </div>
    );
};

const Content = memo(({ is_routed, items, selected }: TContent) => {
    const selected_item = items.find(item => item.label === selected.label);
    const [side_notes, setSideNotes] = React.useState<React.ReactNode[] | null>(null);

    const addToNotesQueue = React.useCallback((notes: React.ReactNode[]) => {
        setSideNotes(notes);
    }, []);

    const MemoizedTabContent = useMemo(() => {
        return selected_item?.value as React.ElementType;
    }, [selected_item?.value]);

    const memoized_routes = useMemo(() => {
        return items.map(({ value, component, path, icon }, idx) => {
            const Component = (value as React.ElementType) || component;
            return (
                <Route
                    key={idx}
                    path={path}
                    render={() => <Component component_icon={icon} setSideNotes={addToNotesQueue} />}
                />
            );
        });
    }, [addToNotesQueue, items]);

    return (
        <React.Fragment>
            {is_routed ? (
                <Switch>{memoized_routes}</Switch>
            ) : (
                <MemoizedTabContent key={selected_item?.label} className='item-id' setSideNotes={addToNotesQueue} />
            )}
            {selected.has_side_note && (
                // for components that have side note, even if no note is passed currently,
                // we want to keep the column space for side note
                <SideNotes side_notes={side_notes} />
            )}
        </React.Fragment>
    );
});

Content.displayName = 'Content';

const VerticalTabContentContainer = ({
    action_bar,
    action_bar_classname,
    className,
    id,
    is_floating,
    is_routed,
    items,
    selected,
    tab_container_classname,
}: TVerticalTabContentContainer) => {
    return (
        <div
            className={classNames('dc-vertical-tab__content', {
                'dc-vertical-tab__content--floating': is_floating,
                [`dc-vertical-tab__content--${className}`]: className,
            })}
        >
            {!is_floating && action_bar && (
                <div
                    className={classNames('dc-vertical-tab__action-bar', {
                        [action_bar_classname as string]: !!action_bar_classname,
                    })}
                >
                    {action_bar.map(({ component, icon, onClick }, idx) => {
                        const Component = component;
                        return Component ? (
                            <Component key={idx} />
                        ) : (
                            <div
                                id={`dt_${id}_close_icon`}
                                className='dc-vertical-tab__action-bar-wrapper'
                                key={idx}
                                onClick={onClick}
                            >
                                <Icon className='dc-vertical-tab__action-bar--icon' icon={icon} />
                            </div>
                        );
                    })}
                </div>
            )}
            <div
                className={classNames(
                    'dc-vertical-tab__content-container',
                    {
                        'dc-vertical-tab__content-container--has-side-note': selected.has_side_note,
                    },
                    tab_container_classname
                )}
            >
                <Content is_routed={is_routed} items={items} selected={selected} />
            </div>
        </div>
    );
};

export default VerticalTabContentContainer;
