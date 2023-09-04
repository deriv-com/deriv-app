import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import { PlatformContext, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

export type TFormBodySection = {
    /**
     *  A boolean value indicating whether the section has a side note.
     */
    has_side_note?: boolean;
    /**
     * The side note to display next to the main content.
     */
    side_note?: string | React.ReactElement;
    /**
     * The position of the side note relative to the main content.
     * @default 'left'
     * */
    side_note_position?: 'left' | 'right';
};

/**
 *  A component that renders a form body section with an optional side note.
 *
 *  This component renders a section of a form body. It can optionally display a side note
 *  and allows reversing the order of the side note and the main content.
 *  @returns {JSX.Element} A React component that renders a form body section.
 */
const FormBodySection = ({
    children,
    has_side_note,
    side_note,
    side_note_position = 'left',
}: React.PropsWithChildren<TFormBodySection>): JSX.Element => {
    const { is_appstore } = React.useContext(PlatformContext);

    if (has_side_note) {
        return (
            <div
                data-testid='dt_side_note_container'
                className={classNames('account-form__section', {
                    'account-form__section--dashboard': is_appstore,
                    'account-form__section--reversed': side_note_position === 'right',
                })}
            >
                <div
                    className={classNames('account-form__section-side-note', {
                        'account-form__section-side-note__example': typeof side_note !== 'string',
                    })}
                >
                    {typeof side_note === 'string' ? (
                        <Text color='less-prominent' size={isMobile() ? 'xxs' : 'xs'} data-testid='side-note-text'>
                            {side_note}
                        </Text>
                    ) : (
                        <React.Fragment>
                            <Text as='p' size={isMobile() ? 'xxs' : 'xs'} weight='bold'>
                                {localize('Example:')}
                            </Text>
                            <div className='account-form__section-side-note__example-image'>{side_note}</div>
                        </React.Fragment>
                    )}
                </div>
                <div className='account-form__section-content'>{children}</div>
            </div>
        );
    }
    return children as JSX.Element;
};

export default FormBodySection;
