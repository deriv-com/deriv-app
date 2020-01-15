import React                  from 'react';
import { VerticalTabWrapper } from './vertical-tab-wrapper.jsx';
import {
    VerticalTabHeader,
    VerticalTabHeaderTitle }  from './vertical-tab-header.jsx';

class VerticalTabHeaders extends React.PureComponent {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.headers = [];
        this.state = { top: 0 };
    }

    componentDidMount() {
        this.headers = this.ref.current.querySelectorAll('.vertical-tab__header__link');
    }

    componentDidUpdate() {
    }

    get offsetTop() {
        const { selected } = this.props;
        return [...this.headers]
            .filter(header => header.innerText === (selected.label || selected.title))[0].offsetTop - 10;
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
                        transform: `translate3d(0, ${this.offset_top}px, 0)`,
                    }}
                    className='vertical-tab__header--highlight'
                />
            </VerticalTabWrapper>
        );
    }
}

export { VerticalTabHeaders };
