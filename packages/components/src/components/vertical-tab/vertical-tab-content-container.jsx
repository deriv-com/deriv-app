import classNames from 'classnames';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { usePrevious } from '../../hooks';
import Icon from '../icon/icon.jsx';

const SideNotes = ({ class_name, side_notes }) => {
    return (
        <div
            className={classNames('dc-vertical-tab__content-side-note', class_name)}
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

const ContentWrapper = ({ children, has_side_note }) => {
    if (has_side_note) {
        return <div className='dc-vertical-tab__content-inner'>{children}</div>;
    }
    return children;
};

const Content = ({ is_routed, items, selected, side_note_class_name, side_note_component }) => {
    const selected_item = items.find(item => item.label === selected.label);
    const previous_selected_item = usePrevious(selected_item);
    const TabContent = selected_item.value;
    const [side_notes, setSideNotes] = React.useState(null);

    const notes_array = [];

    const addToNotesQueue = notes => {
        notes_array.unshift(notes);
        setSideNotes(notes);
    };

    /**
     * Set Side Note Title
     */
    const [side_notes_title, setSideNotesTitle] = React.useState();
    const setTitle = title => setSideNotesTitle(title);

    React.useEffect(() => {
        if (selected_item?.label !== previous_selected_item?.label) {
            setSideNotes(notes_array[0] ?? null);
            notes_array.splice(0, notes_array.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_item]);

    /**
     * Return the component that will be used for showing side notes.
     * This component can be from outside provided by prop named: `side_note_component`
     * And if prop is null, inner `SideNotes` component will be used.
     *
     * @returns {Component}
     */
    const SideNoteComponent = () => {
        const Component = side_note_component ? side_note_component : 'SideNotes';
        return (
            <Component
                selected_item={selected_item}
                side_notes={side_notes}
                class_name={side_note_class_name}
                title={side_notes_title}
            />
        );
    };

    return (
        <React.Fragment>
            {is_routed ? (
                <Switch>
                    {items.map(({ value, component, path, icon }, idx) => {
                        const Component = value || component;
                        return (
                            <Route
                                key={idx}
                                path={path}
                                render={() => (
                                    <Component
                                        component_icon={icon}
                                        setSideNotes={addToNotesQueue}
                                        setSideNotesTitle={setTitle}
                                    />
                                )}
                            />
                        );
                    })}
                </Switch>
            ) : (
                <TabContent
                    key={selected_item.label}
                    className='item-id'
                    setSideNotes={addToNotesQueue}
                    setSideNotesTitle={setTitle}
                />
            )}
            {selected.has_side_note && <SideNoteComponent />}
        </React.Fragment>
    );
};

const VerticalTabContentContainer = ({
    action_bar,
    action_bar_classname,
    className,
    id,
    is_floating,
    is_routed,
    items,
    selected,
    side_note_class_name,
    side_note_component,
    tab_container_classname,
}) => {
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
                        [action_bar_classname]: !!action_bar_classname,
                    })}
                >
                    {action_bar.map(({ component, icon, onClick }, idx) => {
                        const Component = component;
                        return component ? (
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
            <div className={classNames('dc-vertical-tab__content-container', tab_container_classname)}>
                <ContentWrapper has_side_note={selected.has_side_note}>
                    <Content
                        is_routed={is_routed}
                        items={items}
                        selected={selected}
                        side_note_class_name={side_note_class_name}
                        side_note_component={side_note_component}
                    />
                </ContentWrapper>
            </div>
        </div>
    );
};

export default VerticalTabContentContainer;
