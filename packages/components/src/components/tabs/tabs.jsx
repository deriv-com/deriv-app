import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tab from './tab.jsx';

const Tabs = ({
    active_index,
    bottom,
    center,
    children,
    className,
    is_100vw,
    fit_content,
    header_fit_content,
    history,
    onTabItemClick,
    should_update_hash,
    single_tab_has_no_label,
    top,
}) => {
    const [active_tab_index, setActiveTabIndex] = React.useState();
    const [active_line_style, updateActiveLineStyle] = React.useState({});
    const active_tab_ref = React.useRef();
    const tabs_wrapper_ref = React.useRef();

    React.useEffect(() => {
        let initial_index = active_index;
        if (should_update_hash) {
            const hash = location.hash.slice(1);
            const hash_index = children.findIndex(child => child.props && child.props['data-hash'] === hash);
            if (hash_index !== -1) {
                initial_index = hash_index;
                history.push({ hash });
            }
        }
        onClickTabItem(initial_index || 0);
        setActiveLineStyle();
    }, [active_tab_index, location.hash]);

    const onClickTabItem = index => {
        if (should_update_hash) {
            const hash = children[index].props['data-hash'];
            if (hash && hash !== location.hash.slice(1)) {
                history.push({ hash });
            }
        }
        if (typeof onTabItemClick === 'function') {
            onTabItemClick(index);
        }
        setActiveTabIndex(index);
    };

    const setActiveLineStyle = () => {
        const tabs_wrapper_bounds = tabs_wrapper_ref?.current?.getBoundingClientRect();
        const active_tab_bounds = active_tab_ref?.current?.getBoundingClientRect();
        if (tabs_wrapper_bounds && active_tab_bounds) {
            updateActiveLineStyle({
                left: active_tab_bounds.left - tabs_wrapper_bounds.left,
                width: active_tab_bounds.width,
            });
        } else {
            setTimeout(() => {
                setActiveLineStyle();
            }, 500);
        }
    };

    const valid_children = children.filter(child => child);
    const tab_width = fit_content ? '150px' : `${(100 / valid_children.length).toFixed(2)}%`;

    return (
        <div
            className={classNames('dc-tabs', {
                [`dc-tabs dc-tabs--${className}`]: className,
                'dc-tabs--top': top,
                'dc-tabs--100vw': is_100vw,
            })}
            style={{ '--tab-width': `${tab_width}` }}
        >
            <ul
                className={classNames('dc-tabs__list', {
                    'dc-tabs__list--top': top,
                    'dc-tabs__list--bottom': bottom,
                    'dc-tabs__list--center': center,
                    'dc-tabs__list--header-fit-content': header_fit_content,
                })}
                ref={tabs_wrapper_ref}
            >
                {React.Children.map(children, (child, index) => {
                    if (!child) return null;
                    const { count, header_content, label, id } = child.props;
                    return (
                        <Tab
                            count={count}
                            is_active={index === active_tab_index}
                            key={label}
                            is_label_hidden={children.length === 1 && single_tab_has_no_label}
                            label={label}
                            id={id}
                            top={top}
                            bottom={bottom}
                            header_fit_content={header_fit_content}
                            active_tab_ref={index === active_tab_index ? active_tab_ref : null}
                            header_content={header_content}
                            onClick={() => onClickTabItem(index)}
                            setActiveLineStyle={setActiveLineStyle}
                        />
                    );
                })}
                <span
                    className={classNames('dc-tabs__active-line', {
                        'dc-tabs__active-line--top': top,
                        'dc-tabs__active-line--bottom': bottom,
                        'dc-tabs__active-line--fit-content': fit_content,
                        'dc-tabs__active-line--header-fit-content': header_fit_content,
                        'dc-tabs__active-line--is-hidden': children.length === 1 && single_tab_has_no_label,
                    })}
                    style={active_line_style}
                />
            </ul>
            <div className='dc-tabs__content'>
                {React.Children.map(children, (child, index) => {
                    if (index !== active_tab_index) {
                        return undefined;
                    }
                    return child.props.children;
                })}
            </div>
        </div>
    );
};

Tabs.propTypes = {
    active_index: PropTypes.number,
    bottom: PropTypes.bool,
    center: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    className: PropTypes.string,
    fit_content: PropTypes.bool,
    is_100vw: PropTypes.bool,
    header_fit_content: PropTypes.bool,
    history: PropTypes.object,
    onTabItemClick: PropTypes.func,
    should_update_hash: PropTypes.bool,
    single_tab_has_no_label: PropTypes.bool,
    top: PropTypes.bool,
};

export default withRouter(Tabs);
