import React from 'react';
import classNames from 'classnames';
import VerticalTabWrapper from './vertical-tab-wrapper';
import VerticalTabHeader, { TItem } from './vertical-tab-header';
import VerticalTabHeaderGroup from './vertical-tab-header-group';
import VerticalTabHeaderTitle from './vertical-tab-header-title';

type TVerticalTabHeaders = {
    className?: string;
    extra_offset?: number;
    has_mixed_dimensions?: boolean;
    header_title?: string;
    is_collapsible?: boolean;
    is_floating?: boolean;
    is_routed?: boolean;
    item_groups?: TItem[];
    items: TItem[];
    onChange: (item: TItem) => void;
    selected: TItem;
    selectedKey?: string;
};

const offsetTop = (
    extra_offset: number | undefined,
    is_floating: boolean | undefined,
    ref: React.RefObject<HTMLDivElement>,
    selected: Partial<TItem>
) => {
    let calculated_offset = 0;
    let item_offset = 0;
    let selected_el: HTMLDivElement | undefined;
    const headers = ref?.current?.querySelectorAll<HTMLDivElement>(
        '.dc-vertical-tab__header__link, .dc-vertical-tab__header-group__link'
    );

    if (headers) {
        selected_el = [...headers].find(header =>
            selected.getTitle ? header.innerText === selected.getTitle() : header.innerText === selected.label
        );
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
    selectedKey = 'label',
}: TVerticalTabHeaders) => {
    const ref = React.useRef(null);
    const [top, setTop] = React.useState(0);
    const [should_skip_animation, setShouldSkipAnimation] = React.useState(false);

    React.useEffect(() => {
        const selected_item = items.find(
            item => item[selectedKey as keyof TItem] === selected[selectedKey as keyof TItem]
        );
        if (selected_item?.label) setTop(offsetTop(extra_offset, is_floating, ref, { label: selected_item.label }));
    }, [selected, is_floating, extra_offset, selectedKey, items]);
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
                          is_collapsible={is_collapsible}
                          is_routed={is_routed}
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
                                  selectedKey={selectedKey}
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
                          selectedKey={selectedKey}
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
