import PropTypes from 'prop-types';
import React from 'react';
import { DesktopWrapper, Text } from '@deriv/components';
import 'Sass/side-note.scss';

const SideNoteBullet = ({ children }) => (
    <div className='side-note__bullet-wrapper'>
        <div className='side-note__bullet' />
        <span>{children}</span>
    </div>
);

const SideNote = ({ side_notes, title, has_bullets = true }) => (
    <div className='side-note'>
        {title && (
            <DesktopWrapper>
                <Text className='side-note__text' weight='bold' as='p'>
                    {title}
                </Text>
            </DesktopWrapper>
        )}

        {side_notes && side_notes.map((note, i) =>
            has_bullets ? (
                <SideNoteBullet key={i}>{note}</SideNoteBullet>
            ) : (
                <Text key={i} className='side-note__text' size='xxs' as='p'>
                    {note}
                </Text>
            )
        )}
    </div>
);

SideNote.propTypes = {
    side_notes: PropTypes.array,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    has_bullets: PropTypes.bool,
};

export default SideNote;
