import classNames from 'classnames';
import React from 'react';
import VerticalTabWrapper from './vertical-tab-wrapper.jsx';
import VerticalTabHeader from './vertical-tab-header.jsx';
import VerticalTabHeaderGroup from './vertical-tab-header-group.jsx';
import VerticalTabHeaderTitle from './vertical-tab-header-title.jsx';

class VerticalTabHeaders extends React.PureComponent {
    ref = React.createRef();
    headers = [];
    state = { top: 0, should_skip_animation: false };

    componentDidMount() {
        this.repositionActiveHighlighter();
    }

    componentDidUpdate() {
        this.repositionActiveHighlighter();
    }

    onTabChange = item => {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(item);
        }

        this.repositionActiveHighlighter();
    };

    // You can pass true for `should_skip_animation` for uses such as closing a header group.
    // Otherwise, there can be a spotlight effect where the highlighter will gradually animate over to the new offsetTop
    // value of the tab header. This is expected.
    repositionActiveHighlighter = should_skip_animation => {
        this.setState({ top: this.offset_top, should_skip_animation });
    };

    get offset_top() {
        const { selected } = this.props;
        let calculated_offset = 0;

        this.headers = this.ref.current.querySelectorAll('.dc-vertical-tab__header__link');
        let selected_el = null;

        if (selected.path) {
            selected_el = [...this.headers].find(header => header.id === selected.path);
        } else {
            selected_el = [...this.headers].find(header => header.innerText === selected.label);
        }

        if (selected_el) {
            const extra_offset = this.props.is_floating ? 18 : 10;
            calculated_offset = selected_el.offsetTop - extra_offset;
        }

        return calculated_offset;
    }

    render() {
        return (
            <VerticalTabWrapper
                wrapper_ref={this.ref}
                className={classNames(this.props.className, {
                    'dc-vertical-tab__tab--floating': this.props.is_floating,
                })}
            >
                {!this.props.is_floating && this.props.header_title && (
                    <VerticalTabHeaderTitle header_title={this.props.header_title} />
                )}
                {Array.isArray(this.props.item_groups)
                    ? this.props.item_groups.map((group, idx) => (
                          <VerticalTabHeaderGroup
                              onToggle={this.repositionActiveHighlighter}
                              selected={group.subitems.includes(
                                  // See if the index of the currently selected item is in the subitems of this group
                                  this.props.items.findIndex(i => i === this.props.selected)
                              )}
                              items={this.props.items}
                              group={group}
                              key={idx}
                          >
                              {group.subitems.map((item_idx, header_idx) => (
                                  <VerticalTabHeader
                                      item={this.props.items[item_idx]}
                                      onChange={this.onTabChange}
                                      is_floating={this.props.is_floating}
                                      is_routed={this.props.is_routed}
                                      selected={this.props.selected}
                                      key={header_idx}
                                  />
                              ))}
                          </VerticalTabHeaderGroup>
                      ))
                    : this.props.items.map((item, idx) => (
                          <VerticalTabHeader
                              item={item}
                              onChange={this.onTabChange}
                              is_floating={this.props.is_floating}
                              is_routed={this.props.is_routed}
                              selected={this.props.selected}
                              key={idx}
                          />
                      ))}
                <span
                    style={{
                        transition: this.state.should_skip_animation ? 'unset' : 'transform 0.25s ease',
                        transform: `translate3d(0, ${this.state.top}px, 0)`,
                    }}
                    className='dc-vertical-tab__header--highlight'
                />
            </VerticalTabWrapper>
        );
    }
}

export default VerticalTabHeaders;
