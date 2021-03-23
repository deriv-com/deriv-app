const ConditionalWrapper = ({ children, condition, wrap }) => (condition ? wrap(children) : children);

export default ConditionalWrapper;
