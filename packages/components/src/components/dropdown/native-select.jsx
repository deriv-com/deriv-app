import PropTypes from 'prop-types';
import React from 'react';

const NativeSelect = React.forwardRef(({ name, list, value, onChange }, ref) => (
    <div className='dc-native-select dc-native-select__wrapper'>
        <select ref={ref} className='dc-native-select__select' name={name} value={value} onChange={onChange}>
            {Array.isArray(list)
                ? list.map((item, idx) => (
                      <option key={idx} value={item.value} disabled={item.disabled}>
                          {item.nativepicker_text || item.text}
                      </option>
                  ))
                : Object.keys(list).map(key => (
                      <React.Fragment key={key}>
                          <optgroup label={key}>
                              {list[key].map((item, idx) => (
                                  <option key={idx} value={item.value} disabled={item.disabled}>
                                      {item.nativepicker_text || item.text}
                                  </option>
                              ))}
                          </optgroup>
                      </React.Fragment>
                  ))}
        </select>
    </div>
));

NativeSelect.displayName = 'NativeSelect';

NativeSelect.propTypes = {
    list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    name: PropTypes.string,
    nativepicker_text: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default NativeSelect;
