import classNames from 'classnames';
import React from 'react';
import VerticalTabWrapper from './vertical-tab-wrapper.jsx';
import VerticalTabHeader from './vertical-tab-header.jsx';
import VerticalTabHeaderGroup from './vertical-tab-header-group.jsx';
import VerticalTabHeaderTitle from './vertical-tab-header-title.jsx';

const offsetTop = (extra_offset, is_floating, ref, selected) => {
    let calculated_offset = 0;
    let item_offset = 0;

    const headers = ref.current.querySelectorAll(
        '.dc-vertical-tab__header__link, .dc-vertical-tab__header-group__link'
    );
    let selected_el = null;

    if (selected.path) {
        selected_el = [...headers].find(header => header.id === selected.path);
    } else {
        selected_el = [...headers].find(header => header.innerText === selected.label);
    }

    if (selected_el) {
        item_offset = is_floating ? extra_offset || 18 : 10;
        calculated_offset = selected_el.offsetTop && selected_el.offsetTop - item_offset;
    }

    return calculated_offset;
};

const VerticalTabHeaders = ({
    className,
    extra_offset,
    has_mixed_dimensions,
    header_title,
    is_collapsible,
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
        setTop(offsetTop(extra_offset, is_floating, ref, selected));
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
                          onChange={onChange}
                          onToggle={setShouldSkipAnimation}
                          selected={
                              (!has_mixed_dimensions &&
                                  group.subitems?.includes(
                                      // See if the index of the currently selected item is in the subitems of this group
                                      items.findIndex(i => i === selected)
                                  )) ||
                              (!group.subitems && group === selected)
                          }
                          items={items}
                          is_collapsible={is_collapsible}
                          group={group}
                          key={idx}
                      >
                          {group.subitems?.map((item_idx, header_idx) => (
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
