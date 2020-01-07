import classNames             from 'classnames';
import React                  from 'react';
import { VerticalTabWrapper } from './vertical-tab-wrapper.jsx';
import {
    VerticalTabHeader,
    VerticalTabHeaderTitle }  from './vertical-tab-header.jsx';

class VerticalTabHeaders extends React.PureComponent {
    render() {
        return (
            <VerticalTabWrapper
                className={classNames(this.props.className, {
                    'vertical-tab__tab--floating': this.props.is_floating,
                })}
            >
                {!this.props.is_floating && this.props.header_title &&
                <VerticalTabHeaderTitle header_title={this.props.header_title} />
                }
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
            </VerticalTabWrapper>
        );
    }
}

export { VerticalTabHeaders };
