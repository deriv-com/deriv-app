import React from 'react';
import { Autocomplete, Button, DesktopWrapper, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';

import FormFooter from 'Components/form-footer';

const CountrySelector = ({ residence_list, selected_country, setSelectedCountry, handleSelectionNext }) => {
    const [country_list, setCountryList] = React.useState([]);
    const [country_input, setCountryInput] = React.useState('');

    const handleMobileSelect = e => {
        setCountryInput(e?.target?.value);
        const matching_country = country_list.find(c => c.text === e?.target?.value);
        if (matching_country) {
            setSelectedCountry(matching_country);
        }
    };

    React.useEffect(() => {
        const countries = residence_list.filter(r => !r.disabled);
        setCountryList(countries);
    }, [residence_list]);

    return (
        <>
            <div className='proof-of-identity__container'>
                <Text className='proof-of-identity__header' align='center' weight='bold'>
                    {localize('Proof of Identity')}
                </Text>
                <Text className='proof-of-identity__country-text ' size='xs'>
                    {localize('In which country was your document issued?')}
                </Text>
                <fieldset className='proof-of-identity__fieldset'>
                    <DesktopWrapper>
                        <Autocomplete
                            data-lpignore='true'
                            autoComplete='off' // prevent chrome autocomplete
                            type='text'
                            label={localize('Country')}
                            list_items={country_list}
                            value={country_input}
                            onChange={e => setCountryInput(e?.target?.value)}
                            onItemSelection={item => {
                                setSelectedCountry(item);
                                setCountryInput(item.text);
                            }}
                            required
                        />
                    </DesktopWrapper>
                    <MobileWrapper>
                        <div className='proof-of-identity__dropdown-container'>
                            <SelectNative
                                placeholder={localize('Place of birth')}
                                label={localize('Country')}
                                list_items={country_list}
                                value={country_input}
                                onChange={handleMobileSelect}
                                use_text={true}
                                required
                            />
                        </div>
                    </MobileWrapper>
                </fieldset>
            </div>
            <FormFooter className='proof-of-identity__footer'>
                <Button
                    className='proof-of-identity__submit-button'
                    type='button'
                    is_disabled={!selected_country}
                    has_effect
                    is_loading={false}
                    text={localize('Next')}
                    onClick={handleSelectionNext}
                    large
                    primary
                />
            </FormFooter>
        </>
    );
};

export default CountrySelector;
