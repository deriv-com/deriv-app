import PropTypes      from 'prop-types';
import React          from 'react';
import posed,
{ PoseGroup }         from 'react-pose';

const FadeDiv = posed.div({
    enter: {
        opacity   : 1,
        transition: { duration: 300 },
    },
    exit: {
        opacity   : 0,
        transition: { duration: 300 },
    },
});

const FadeWrapper = ({
    children,
    className,
    keyname,
    is_visible,
}) => (
    <PoseGroup>
        {is_visible &&
            <FadeDiv className={className} key={keyname}>
                {children}
            </FadeDiv>
        }
    </PoseGroup>
);

FadeWrapper.propTypes = {
    children  : PropTypes.node,
    is_visible: PropTypes.bool,
    keyname   : PropTypes.string,
};

export { FadeWrapper };
