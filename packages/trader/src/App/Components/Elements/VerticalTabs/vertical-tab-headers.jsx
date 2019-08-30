import React                  from 'react';
import { VerticalTabWrapper } from './vertical-tab-wrapper.jsx';
import { VerticalTabHeader }  from './vertical-tab-header.jsx';

class VerticalTabHeaders extends React.PureComponent {
    render() {
        return (
            <VerticalTabWrapper>
                {this.props.header_title &&
                    <div className='vertical-tab__header-title'>
                        <p>{ this.props.header_title }</p>
                    </div>
                }

                {this.props.items.map(item => (
                    <VerticalTabHeader
                        item={item}
                        onChange={this.props.onChange}
                        is_routed={this.props.is_routed}
                        selected={this.props.selected}
                        key={item.label}
                    />
                )
                )}
            </VerticalTabWrapper>
        );
    }
}

export { VerticalTabHeaders };
