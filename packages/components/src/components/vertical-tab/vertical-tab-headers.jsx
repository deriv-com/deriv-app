import classNames from 'classnames';
import React from 'react';
import VerticalTabWrapper from './vertical-tab-wrapper.jsx';
import VerticalTabHeader from './vertical-tab-header.jsx';
import VerticalTabHeaderGroup from './vertical-tab-header-group.jsx';
import VerticalTabHeaderTitle from './vertical-tab-header-title.jsx';

const offsetTop = (is_floating, ref, selected) => {
    let calculated_offset = 0;

    const headers = ref.current.querySelectorAll('.dc-vertical-tab__header__link');
    let selected_el = null;

    if (selected.path) {
        selected_el = [...headers].find(header => header.id === selected.path);
    } else {
        selected_el = [...headers].find(header => header.innerText === selected.label);
    }

    if (selected_el) {
        const extra_offset = is_floating ? 18 : 10;
        calculated_offset = selected_el.offsetTop - extra_offset;
    }

    return calculated_offset;
};

const VerticalTabHeaders = ({
    className,
    header_title,
    is_floating,
    is_routed,
    item_groups,
    items,
    onChange,
    selected,
}) => {
    const ref = React.useRef(null);
    const [top, setTop] = React.useState(0);
    const [should_skip_animation, setShouldSkipAnimation] = React.useState(false);

    React.useEffect(() => {
        setTop(offsetTop(is_floating, ref, selected));
    }, [selected]);

    return (
        <VerticalTabWrapper
            wrapper_ref={ref}
            className={classNames(className, {
                'dc-vertical-tab__tab--floating': is_floating,
            })}
        >
            {!is_floating && header_title && <VerticalTabHeaderTitle header_title={header_title} />}
            {Array.isArray(item_groups)
                ? item_groups.map((group, idx) => (
                      <VerticalTabHeaderGroup
                          onToggle={setShouldSkipAnimation}
                          selected={group.subitems.includes(
                              // See if the index of the currently selected item is in the subitems of this group
                              items.findIndex(i => i === selected)
                          )}
                          items={items}
                          group={group}
                          key={idx}
                      >
                          {group.subitems.map((item_idx, header_idx) => (
                              <VerticalTabHeader
                                  item={items[item_idx]}
                                  onChange={onChange}
                                  is_floating={is_floating}
                                  is_routed={is_routed}
                                  selected={selected}
                                  key={header_idx}
                              />
                          ))}
                      </VerticalTabHeaderGroup>
                  ))
                : items.map((item, idx) => (
                      <VerticalTabHeader
                          item={item}
                          onChange={onChange}
                          is_floating={is_floating}
                          is_routed={is_routed}
                          selected={selected}
                          key={idx}
                      />
                  ))}
            <span
                style={{
                    transition: should_skip_animation ? 'unset' : 'transform 0.25s ease',
                    transform: `translate3d(0, ${top}px, 0)`,
                }}
                className='dc-vertical-tab__header--highlight'
            />
        </VerticalTabWrapper>
    );
};

export default VerticalTabHeaders;
