import React            from 'react';
import { PropTypes }    from 'prop-types';
import { localize }     from 'deriv-translations/src/i18next/i18n';

const FlyoutText = props => {
    const { text } = props;

    return (
        <p className='flyout__item'>{localize(text)}</p>
    );
};

FlyoutText.propTypes = {
    text: PropTypes.string,
};

export default FlyoutText;
