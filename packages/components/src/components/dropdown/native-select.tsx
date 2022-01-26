import React from 'react';

type NativeSelectProps = {
    list: unknown;
    name: string;
    nativepicker_text: string;
    onChange: () => void;
    value: unknown | number | string;
};

const NativeSelect = React.forwardRef(({ name, list, value, onChange }: NativeSelectProps, ref) => (
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

export default NativeSelect;
