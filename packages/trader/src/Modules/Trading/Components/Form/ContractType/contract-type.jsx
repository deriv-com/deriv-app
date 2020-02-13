import React from 'react';
import Dialog from './contract-type-dialog.jsx';
import Display from './contract-type-display.jsx';
import List from './contract-type-list.jsx';
import Info from './ContractTypeInfo';

const ContractType = ({ children }) => <>{children}</>;

ContractType.Dialog = Dialog;
ContractType.Display = Display;
ContractType.List = List;
ContractType.Info = Info;

export default ContractType;
