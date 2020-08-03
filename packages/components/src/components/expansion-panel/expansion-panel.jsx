import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

class ExpansionPanel extends React.Component {
    state = {
        open_ids: [],
        is_open: false,
    };

    onClick = () => {
        // close if clicking the expansion panel that's open, otherwise open the new one
        this.setState({ is_open: !this.state.is_open });
    };

    onArrayItemClick = id => {
        this.setState(state => {
            if (state.open_ids.includes(id)) {
                const open_ids = state.open_ids.filter(open_id => open_id !== id);
                return {
                    ...state,
                    open_ids,
                };
            }
            return {
                ...state,
                open_ids: [...state.open_ids, id],
            };
        });
    };

    renderArrayContent = array => {
        return (
            <div>
                {array.map((item, index) => {
                    if (item && item.value !== undefined && item.value !== null && Array.isArray(item.value)) {
                        return (
                            <div key={index} className='dc-expansion-panel__content-array'>
                                <div
                                    className={classNames('dc-expansion-panel__content-array', {
                                        'dc-expansion-panel__content-active': this.state.open_ids.includes(item.id),
                                    })}
                                >
                                    <span className='dc-expansion-panel__content-array-item-index'>{index + 1}: </span>(
                                    {item.value.length})
                                    <Icon
                                        className='dc-expansion-panel__content-chevron-icon'
                                        icon='IcChevronRight'
                                        onClick={() => this.onArrayItemClick(item.id)}
                                    />
                                </div>
                                {this.state.open_ids.includes(item.id)
                                    ? this.renderArrayContent(item.value.slice())
                                    : null}
                            </div>
                        );
                    }
                    return (
                        <div key={index} className='dc-expansion-panel__content-array'>
                            <span className='dc-expansion-panel__content-array-item-index'>{index + 1}:</span>
                            {item && item.value !== undefined && item.value !== null
                                ? item.value.toString()
                                : undefined}
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
                <div
                    className={classNames('dc-expansion-panel__header-container', {
                        'dc-expansion-panel__header-active': this.state.is_open,
                    })}
                >
                    {message.header}
                    <Icon
                        icon='IcChevronDownBold'
                        className='dc-expansion-panel__header-chevron-icon'
                        onClick={this.onClick}
                    />
                </div>
                {!!this.state.is_open &&
                    (Array.isArray(message.content)
                        ? this.renderArrayContent(message.content.slice())
                        : message.content)}
            </>
        );
    }
}

ExpansionPanel.propTypes = {
    message: PropTypes.object,
};

export default ExpansionPanel;
