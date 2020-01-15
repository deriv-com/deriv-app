import React                  from 'react';
import { VerticalTabWrapper } from './vertical-tab-wrapper.jsx';
import {
    VerticalTabHeader,
    VerticalTabHeaderTitle }  from './vertical-tab-header.jsx';

class VerticalTabHeaders extends React.PureComponent {
    ref     = React.createRef();
    headers = [];
    state   = { top: 0 };

    componentDidMount() {
        this.headers = this.ref.current.querySelectorAll('.vertical-tab__header__link');
        this.setState({ top: this.offset_top });
    }

    componentDidUpdate() {
        this.setState({ top: this.offset_top });
    }

    get offset_top() {
        const { selected } = this.props;

        const selected_el = [...this.headers]
            .filter(header => header.innerText === (selected.label || selected.title))[0];

        return selected_el ? selected_el.offsetTop - 10 : 0;
    }

    render() {
        return (
            <VerticalTabWrapper wrapper_ref={this.ref} className={this.props.className}>
                {this.props.header_title &&
                    <VerticalTabHeaderTitle header_title={this.props.header_title} />
                }
                {this.props.items.map((item, idx) => (
                    <VerticalTabHeader
                        item={item}
                        onChange={this.props.onChange || undefined}
                        is_routed={this.props.is_routed}
                        selected={this.props.selected}
                        key={idx}
                    />
                ))}
                <span
                    style={{
                        transform: `translate3d(0, ${this.state.top}px, 0)`,
                    }}
                    className='vertical-tab__header--highlight'
                />
            </VerticalTabWrapper>
        );
    }
}

export { VerticalTabHeaders };
