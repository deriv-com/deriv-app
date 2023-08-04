import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { PlatformContext, isMobile } from '@deriv/shared';

export type TFormBodySection = {
    has_side_note?: boolean;
    side_note?: string | React.ReactElement;
    is_reversed?: boolean;
};

/**
 *  A component that renders a form body section with an optional side note.
 *
 *  This component renders a section of a form body. It can optionally display a side note
 *  and allows reversing the order of the side note and the main content.
 *
 *  @param {TFormBodySection} props - The properties of the FormBodySection component.
 *  @param {boolean} props.has_side_note - Whether to display a side note.
 *  @param {string | React.ReactElement} props.side_note - The content of the side note.
 *  @param {boolean} props.is_reversed - Whether to reverse the order of the side note and the content.
 *  @returns {JSX.Element} A React component that renders a form body section.
 */
const FormBodySection = ({
    children,
    has_side_note,
    side_note,
    is_reversed,
}: React.PropsWithChildren<TFormBodySection>): JSX.Element => {
    const { is_appstore } = React.useContext(PlatformContext);

    if (has_side_note) {
        return (
            <div
                data-testid='dt_side_note_container'
                className={classNames('account-form__section', {
                    'account-form__section--dashboard': is_appstore,
                    'account-form__section--reversed': is_reversed,
                })}
            >
                <div className='account-form__section-side-note'>
                    {typeof side_note === 'string' ? (
                        <Text color='less-prominent' size={isMobile() ? 'xxs' : 'xs'} data-testid='side-note-text'>
                            {side_note}
                        </Text>
                    ) : (
                        side_note
                    )}
                </div>
                <div className='account-form__section-content'>{children}</div>
            </div>
        );
    }
    return children as JSX.Element;
};

export default FormBodySection;
