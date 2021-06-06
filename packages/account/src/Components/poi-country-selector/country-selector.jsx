import React from 'react';
import { Autocomplete, Button, DesktopWrapper, MobileWrapper, Text, SelectNative } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import FormBody from 'Components/form-body';
import FormFooter from 'Components/form-footer';

const CountrySelector = ({ fetchResidenceList }) => {
    const [country_list, setCountryList] = React.useState([]);

    React.useEffect(() => {
        if (country_list.length === 0) {
            fetchResidenceList().then(data => {
                const countries = data.residence_list.filter(r => !r.disabled).map(i => i.text);
                setCountryList(countries);
            });
        }
    }, []);

    return (
        <React.Fragment>
            <FormBody>
                <div className='proof-of-identity__header-container'>
                    <div className='proof-of-identity__header'>
                        <Text align='center' weight='bold'>
                            Proof of Identity
                        </Text>
                    </div>
                    <Text size='xs'>In which country was your document issued?</Text>
                    <DesktopWrapper>
                        <div className='proof-of-identity__dropdown-container'>
                            <Autocomplete
                                data-lpignore='true'
                                autoComplete='off' // prevent chrome autocomplete
                                type='text'
                                label={localize('Country')}
                                list_items={country_list}
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
                </div>
            </FormBody>
            <FormFooter>
                <Button
                    type='button'
                    is_disabled={false}
                    has_effect
                    is_loading={false}
                    text={localize('Next')}
                    large
                    primary
                />
            </FormFooter>
        </React.Fragment>
    );
};

export default connect(({ client }) => ({
    fetchResidenceList: client.fetchResidenceList,
}))(CountrySelector);
