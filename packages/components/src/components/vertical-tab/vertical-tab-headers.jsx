import classNames from 'classnames';
import React from 'react';
import VerticalTabWrapper from 'Components/vertical-tab/vertical-tab-wrapper.jsx';
import VerticalTabHeader from 'Components/vertical-tab/vertical-tab-header.jsx';
import VerticalTabHeaderTitle from 'Components/vertical-tab/vertical-tab-header-title.jsx';

class VerticalTabHeaders extends React.PureComponent {
    ref = React.createRef();
    headers = [];
    state = { top: 0 };

    componentDidUpdate() {
        this.setState({ top: this.offset_top });
    }

    get offset_top() {
        const { selected } = this.props;
        let calculated_offset = 0;

        this.headers = this.ref.current.querySelectorAll('.dc-vertical-tab__header__link');

        const selected_el = [...this.headers].find(header => header.innerText === (selected.label || selected.title));

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
                {this.props.items.map((item, idx) => (
                    <VerticalTabHeader
                        item={item}
                        onChange={this.props.onChange || undefined}
                        is_floating={this.props.is_floating}
                        is_routed={this.props.is_routed}
                        selected={this.props.selected}
                        key={idx}
                    />
                ))}
                <span
                    style={{
                        transform: `translate3d(0, ${this.state.top}px, 0)`,
                    }}
                    className='dc-vertical-tab__header--highlight'
                />
            </VerticalTabWrapper>
        );
    }
}

export default VerticalTabHeaders;
