import React                  from 'react';
import VerticalTabHeader      from '../vertical-tab-header';
import VerticalTabHeaderTitle from '../vertical-tab-header-title';
import VerticalTabWrapper     from '../vertical-tab-wrapper';

export default class VerticalTabHeaders extends React.PureComponent {
    render() {
        return (
            <VerticalTabWrapper className={this.props.className}>
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
            </VerticalTabWrapper>
        );
    }
}
