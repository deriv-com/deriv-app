import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { DesktopWrapper, MobileWrapper, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import './side-note.scss';

const SideNoteTitle = ({ side_notes, title }) => (
    <Text className='side-note__title' weight='bold' as='p'>
        {title ||
            (side_notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />)}
    </Text>
);

const SideNoteBullet = ({ children }) => (
    <div className='side-note__bullet-wrapper'>
        <div className='side-note__bullet' />
        <div>{children}</div>
    </div>
);

const SideNote = ({ children, side_notes, title, has_bullets = true, is_mobile, className }) => {
    const Wrapper = is_mobile ? MobileWrapper : DesktopWrapper;

    return (
        <>
            {(children || side_notes?.length) && (
                <Wrapper>
                    <div className={classNames('side-note', { 'side-note--mobile': isMobile() }, className)}>
                        <DesktopWrapper>
                            <SideNoteTitle side_notes={side_notes} title={title} />
                        </DesktopWrapper>

                        {children && <>{children}</>}

                        {!children &&
                            side_notes?.length &&
                            side_notes.map((note, i) =>
                                has_bullets ? (
                                    <SideNoteBullet key={i}>{note}</SideNoteBullet>
                                ) : (
                                    <Text key={i} className='side-note__text' size='xxs' as='p'>
                                        {note}
                                    </Text>
                                )
                            )}
                    </div>
                </Wrapper>
            )}
        </>
    );
};

SideNote.propTypes = {
    children: PropTypes.any,
    side_notes: PropTypes.array,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_bullets: PropTypes.bool,
    is_mobile: PropTypes.bool,
    className: PropTypes.string,
};

export default SideNote;
