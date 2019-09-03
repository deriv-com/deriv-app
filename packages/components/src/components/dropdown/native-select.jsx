import PropTypes from 'prop-types';
import React     from 'react';

const NativeSelect = ({
    name,
    list,
    value,
    onChange,
}) => (
    <div className='native-select native-select__wrapper'>
        <select className='select native-select__select' name={name} value={value} onChange={onChange}>
            {Array.isArray(list) ?
                list.map((item, idx) => (
                    <option key={idx} value={item.value}>{item.text}</option>
                ))
                :
                Object.keys(list).map(key => (
                    <React.Fragment key={key}>
                        <optgroup label={key}>
                            {list[key].map((item, idx) => (
                                <option key={idx} value={item.value}>{item.text}</option>
                            ))}
                        </optgroup>
                    </React.Fragment>
                ))}
        </select>
    </div>
);

NativeSelect.propTypes = {
    list: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
    name    : PropTypes.string,
    onChange: PropTypes.func,
    value   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default NativeSelect;
