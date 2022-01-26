import classNames from 'classnames';
import React from 'react';
import ArrayRenderer from './array-renderer.jsx';
import Icon from '../icon';

type ExpansionPanelProps = {
    message: unknown;
};

const ExpansionPanel = ({ message, onResize }: ExpansionPanelProps) => {
    const [open_ids, setOpenIds] = React.useState([]);
    const [is_open, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        if (typeof onResize === 'function') {
            onResize();
        }
    }, [is_open]);

    const onClick = () => {
        // close if clicking the expansion panel that's open, otherwise open the new one
        setIsOpen(!is_open);
    };

    return (
        <React.Fragment>
            <div
                className={classNames('dc-expansion-panel__header-container', {
                    'dc-expansion-panel__header-active': is_open,
                })}
            >
                {message.header}
                <Icon icon='IcChevronDownBold' className='dc-expansion-panel__header-chevron-icon' onClick={onClick} />
            </div>
            {is_open &&
                (Array.isArray(message.content) ? (
                    <ArrayRenderer array={message.content} open_ids={open_ids} setOpenIds={setOpenIds} />
                ) : (
                    message.content
                ))}
        </React.Fragment>
    );
};

export default ExpansionPanel;
