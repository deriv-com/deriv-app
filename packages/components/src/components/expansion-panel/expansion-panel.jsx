import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

class ExpansionPanel extends React.Component {
    state = {
        open_id: [],
        isOpen: false,
    };

    onClick = () => {
        // close if clicking the expansion panel that's open, otherwise open the new one
        this.setState({ isOpen: !this.state.isOpen });
    };

    onArrayItemClick = id => {
        this.setState(state => {
            if (state.open_id.includes(id)) {
                const open_id = state.open_id.filter(item => {
                    return item !== id;
                });
                return {
                    ...state,
                    open_id,
                };
            }
            return {
                ...state,
                open_id: [...state.open_id, id],
            };
        });
    };

    renderArrayContent = array => {
        return (
            <div>
                {array.map((item, index) => {
                    if (Array.isArray(item.value)) {
                        return (
                            <div key={index} className='dc-expansion-panel__content-array'>
                                <span className='dc-expansion-panel__content-array-item-index'>{index + 1}: </span>(
                                {item.value.length})
                                {this.state.open_id.includes(item.id) ? (
                                    <Icon
                                        className='dc-expansion-panel__content-chevron-icon'
                                        icon='IcChevronDown'
                                        onClick={() => this.onArrayItemClick(item.id)}
                                    />
                                ) : (
                                    <Icon
                                        className='dc-expansion-panel__content-chevron-icon'
                                        icon='IcChevronRight'
                                        onClick={() => this.onArrayItemClick(item.id)}
                                    />
                                )}
                                {this.state.open_id.includes(item.id) ? (
                                    <div className='dc-expansion-panel__content-array'>
                                        {this.renderArrayContent(item.value.slice())}
                                    </div>
                                ) : null}
                            </div>
                        );
                    }
                    return (
                        <div key={index} className='dc-expansion-panel__content-array'>
                            <span className='dc-expansion-panel__content-array-item-index'>{index + 1}:</span>
                            {item.value.toString()}
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { message } = this.props;

        return (
            <>
                <div className='dc-expansion-panel__header-container'>
                    {Array.isArray(message.content) ? 'List: (' + message.header + ')' : message.header}
                    {this.state.isOpen ? (
                        <Icon icon='IcChevronUpBold' onClick={this.onClick} />
                    ) : (
                        <Icon icon='IcChevronDownBold' onClick={this.onClick} />
                    )}
                </div>
                {this.state.isOpen
                    ? Array.isArray(message.content)
                        ? this.renderArrayContent(message.content.slice())
                        : message.content
                    : null}
            </>
        );
    }
}

ExpansionPanel.propTypes = {
    message: PropTypes.object,
};

export default ExpansionPanel;
