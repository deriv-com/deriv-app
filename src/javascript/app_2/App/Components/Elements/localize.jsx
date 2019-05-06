import PropTypes        from 'prop-types';
import React            from 'react';
import { localize }     from '_common/localize';
import { fillTemplate } from 'Utils/Language/fill-template';

const Localize = ({ str, replacers }) => {
    const localized = localize(str /* localize-ignore */); // should be localized on the caller side

    if (!/\[_\d+\]/.test(localized)) {
        return <React.Fragment>{localized}</React.Fragment>;
    }

    return (
        <React.Fragment>
            {fillTemplate(localized, replacers)}
        </React.Fragment>
    );
};

Localize.propTypes = {
    replacers: PropTypes.object,
    str      : PropTypes.string,
};

export default Localize;
