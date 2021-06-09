import React from 'react';
import { Autocomplete, Button, DesktopWrapper, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import FormFooter from 'Components/form-footer';

const CountrySelector = ({ fetchResidenceList }) => {
    const [country_list, setCountryList] = React.useState([]);
    const [selected_country, setSelectedCountry] = React.useState(null);

    React.useEffect(() => {
        if (country_list.length === 0) {
            fetchResidenceList().then(data => {
                const countries = data.residence_list
                    .filter(r => !r.disabled)
                    .map(i => ({
                        text: i.text,
                        value: i.value,
                    }));

                setCountryList(countries);
            });
        }
    }, []);

    return (
        <>
            <div className='proof-of-identity__container'>
                <Text className='proof-of-identity__header' align='center' weight='bold'>
                    Proof of Identity
                </Text>
                <Text className='proof-of-identity__header' size='xs'>
                    In which country was your document issued?
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
                                onItemSelection={({ text, value }) => {
                                    setSelectedCountry({ text, value });
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
                    large
                    primary
                />
            </FormFooter>
        </>
    );
};

export default connect(({ client }) => ({
    fetchResidenceList: client.fetchResidenceList,
}))(CountrySelector);
