import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

const ExpansionPanel = ({ message }) => {
    const [open_ids, setOpenIds] = React.useState([]);
    const [is_open, setIsOpen] = React.useState(false);

    const onClick = () => {
        // close if clicking the expansion panel that's open, otherwise open the new one
        setIsOpen(!is_open);
    };

    const onArrayItemClick = id => {
        if (open_ids.includes(id)) {
            setOpenIds(open_ids.filter(open_id => open_id !== id));
        } else {
            setOpenIds([...open_ids, id]);
        }
    };

    const renderArrayContent = array => {
        return (
            <div>
                {array.map((item, index) => {
                    if (item && item.value !== undefined && item.value !== null && Array.isArray(item.value)) {
                        return (
                            <div key={index} className='dc-expansion-panel__content-array'>
                                <div
                                    className={classNames('dc-expansion-panel__content-array', {
                                        'dc-expansion-panel__content-active': open_ids.includes(item.id),
                                    })}
                                >
                                    <span className='dc-expansion-panel__content-array-item-index'>{index + 1}: </span>(
                                    {item.value.length})
                                    <Icon
                                        className='dc-expansion-panel__content-chevron-icon'
                                        icon='IcChevronRight'
                                        onClick={() => onArrayItemClick(item.id)}
                                    />
                                </div>
                                {open_ids.includes(item.id) ? renderArrayContent(item.value.slice()) : null}
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

    return (
        <>
            <div
                className={classNames('dc-expansion-panel__header-container', {
                    'dc-expansion-panel__header-active': is_open,
                })}
            >
                {message.header}
                <Icon icon='IcChevronDownBold' className='dc-expansion-panel__header-chevron-icon' onClick={onClick} />
            </div>
            {!!is_open &&
                (Array.isArray(message.content) ? renderArrayContent(message.content.slice()) : message.content)}
        </>
    );
};

ExpansionPanel.propTypes = {
    message: PropTypes.object,
};

export default ExpansionPanel;
