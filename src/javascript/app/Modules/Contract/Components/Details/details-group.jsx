import { observer }      from 'mobx-react';
import PropTypes         from 'prop-types';
import React             from 'react';
import { isEmptyObject } from '_common/utility';

const DetailsGroup = ({
    items,
    title,
}) => (
    !title || isEmptyObject(items)
        ? ''
        : (
            <React.Fragment>
                <div className='info-header'>{title}</div>
                { Object.keys(items).map(key => (
                    <div className='info-item' key={key}>
                        <div>{key}</div>
                        <div>{items[key]}</div>
                    </div>
                ))}
            </React.Fragment>
        )
);

DetailsGroup.propTypes = {
    items: PropTypes.object,
    title: PropTypes.string,
};

export default observer(DetailsGroup);
