import classNames from 'classnames';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { usePrevious } from '../../hooks';
import { TItem } from './vertical-tab-header';

type TSideNotes = {
    class_name?: string;
    side_notes: React.ReactNode[] | null;
};

type TContentWrapper = {
    has_side_note?: boolean;
};

type TContent = {
    is_routed?: boolean;
    items: TItem[];
    selected: TItem;
};

type TVerticalTabContentContainer = TContent & {
    className?: string;
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

const ContentWrapper = ({ children, has_side_note }: React.PropsWithChildren<TContentWrapper>) => {
    if (has_side_note) {
        return <div className='dc-vertical-tab__content-inner'>{children}</div>;
    }
    return children as JSX.Element;
};

const Content = ({ is_routed, items, selected }: TContent) => {
    const selected_item = items.find(item => item.label === selected.label);
    const previous_selected_item = usePrevious(selected_item);
    const TabContent = selected_item?.value as React.ElementType;
    const [side_notes, setSideNotes] = React.useState<React.ReactNode[] | null>(null);

    const notes_array: React.ReactNode[] = [];

    const addToNotesQueue = React.useCallback((notes: React.ReactNode) => {
        notes_array.unshift(notes);
        setSideNotes(notes_array);
    }, []);

    React.useEffect(() => {
        if (selected_item?.label !== previous_selected_item?.label) {
            setSideNotes(notes_array[0] ? notes_array : null);
            notes_array.splice(0, notes_array.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_item]);

    return (
        <React.Fragment>
            {is_routed ? (
                <Switch>
                    {items.map(({ value, component, path, icon }, idx) => {
                        const Component = (value as React.ElementType) || (component as React.ElementType);
                        return (
                            <Route
                                key={idx}
                                path={path}
                                render={() => <Component component_icon={icon} setSideNotes={addToNotesQueue} />}
                            />
                        );
                    })}
                </Switch>
            ) : (
                <TabContent key={selected_item!.label} className='item-id' setSideNotes={addToNotesQueue} />
            )}
            {selected.has_side_note && (
                // for components that have side note, even if no note is passed currently,
                // we want to keep the column space for side note
                <SideNotes side_notes={side_notes} />
            )}
        </React.Fragment>
    );
};

const VerticalTabContentContainer = ({
    className,
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
            <div className={classNames('dc-vertical-tab__content-container', tab_container_classname)}>
                <ContentWrapper has_side_note={selected.has_side_note}>
                    <Content is_routed={is_routed} items={items} selected={selected} />
                </ContentWrapper>
            </div>
        </div>
    );
};

export default VerticalTabContentContainer;
