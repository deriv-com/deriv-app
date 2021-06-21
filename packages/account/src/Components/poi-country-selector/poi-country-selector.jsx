import React from 'react';
import { Autocomplete, Button, DesktopWrapper, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';

import FormFooter from 'Components/form-footer';

const CountrySelector = ({ residence_list, selected_country, setSelectedCountry, handleSelectionNext }) => {
    const [country_list, setCountryList] = React.useState([]);

    React.useEffect(() => {
        if (country_list.length === 0) {
            const countries = residence_list.filter(r => !r.disabled);
            setCountryList(countries);
        }
    }, []);

    return (
        <>
            <div className='proof-of-identity__container'>
                <Text className='proof-of-identity__header' align='center' weight='bold'>
                    {localize('Proof of Identity')}
                </Text>
                <Text className='proof-of-identity__header' size='xs'>
                    {localize('In which country was your document issued?')}
                </Text>
                <fieldset className='proof-of-identity__fieldset'>
                    <DesktopWrapper>
                        <div className='proof-of-identity__dropdown-container'>
                            <Autocomplete
                                data-lpignore='true'
                                autoComplete='off' // prevent chrome autocomplete
                                type='text'
                                label={localize('Country')}
                                list_items={country_list}
                                value={selected_country ? selected_country.text : ''}
                                onChange={e => setSelectedCountry(e?.target?.value)}
                                onItemSelection={item => {
                                    setSelectedCountry(item);
                                }}
                                required
                            />
                        </div>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <SelectNative
                            placeholder={localize('Place of birth')}
                            label={localize('Country')}
                            list_items={country_list}
                            use_text={true}
                            required
                        />
                    </MobileWrapper>
                </fieldset>
            </div>
            <FormFooter>
                <Button
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
