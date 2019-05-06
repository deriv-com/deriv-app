import React from 'react';

class VerticalTabContentContainer extends React.PureComponent {
    render() {
        const selected   = this.props.items.find(item => item.label === this.props.selected.label);
        const TabContent = selected.value;

        return (
            <div className='vertical-tab__content'>
                <TabContent
                    key={selected.label}
                    className='item-id'
                />
            </div>
        );
    }
}

export { VerticalTabContentContainer };
