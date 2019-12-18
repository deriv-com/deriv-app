import React                  from 'react';
import VerticalTabHeader      from 'Components/vertical-tabs/vertical-tab-header';
import VerticalTabHeaderTitle from 'Components/vertical-tabs/vertical-tab-header-title';
import VerticalTabWrapper     from 'Components/vertical-tabs/vertical-tab-wrapper';

const VerticalTabHeaders = (props) => (
    <VerticalTabWrapper className={props.className}>
        { props.header_title &&
            <VerticalTabHeaderTitle header_title={props.header_title} />
        }
        { props.items.map((item, idx) => (
            <VerticalTabHeader
                item={item}
                onChange={props.onChange || undefined}
                is_routed={props.is_routed}
                selected={props.selected}
                key={idx}
            />
        ))}
    </VerticalTabWrapper>
);

export default VerticalTabHeaders;
