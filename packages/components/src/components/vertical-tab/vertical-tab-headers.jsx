import classNames from 'classnames';
import React from 'react';
import VerticalTabWrapper from 'Components/vertical-tab/vertical-tab-wrapper.jsx';
import VerticalTabHeader from 'Components/vertical-tab/vertical-tab-header.jsx';
import VerticalTabHeaderTitle from 'Components/vertical-tab/vertical-tab-header-title.jsx';

const VerticalTabHeaders = props => (
    <VerticalTabWrapper
        className={classNames(this.props.className, {
            'vertical-tab__tab--floating': this.props.is_floating,
        })}
    >
        {!this.props.is_floating && this.props.header_title && (
            <VerticalTabHeaderTitle header_title={this.props.header_title} />
        )}
        {props.header_title && <VerticalTabHeaderTitle header_title={props.header_title} />}
        {props.items.map((item, idx) => (
            <VerticalTabHeader
                item={item}
                onChange={props.onChange || undefined}
                is_floating={this.props.is_floating}
                is_routed={props.is_routed}
                selected={props.selected}
                key={idx}
            />
        ))}
    </VerticalTabWrapper>
);

export default VerticalTabHeaders;
