import React from 'react';
import { localize } from '@deriv/translations';
import FormBody from 'Components/form-body';
import FormSubHeader from 'Components/form-sub-header';

// const TradingExperienceDropdown = ({ item_list, onChange, values }) => {
//     return (
//         <React.Fragment>
//             <Text as='h1' color='prominent' weight='bold' size='xs'>
//                 {}
//             </Text>
//             <Dropdown is_align_text_left />
//         </React.Fragment>
//     );
// };

const TradingExperience = () => {
    return (
        <form>
            <FormBody>
                <FormSubHeader
                    title={localize('Trading Experience')}
                    subtitle={`(${localize('All fields are required')})`}
                />
            </FormBody>
        </form>
    );
};

export default TradingExperience;
