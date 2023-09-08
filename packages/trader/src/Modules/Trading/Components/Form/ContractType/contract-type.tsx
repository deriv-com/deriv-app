import React from 'react';
import Dialog from './contract-type-dialog';
import Display from './contract-type-display';
import List from './contract-type-list';
import Info from './ContractTypeInfo';

const ContractType = ({ children }: React.PropsWithChildren<{ children: React.ReactNode }>) => <>{children}</>;

ContractType.Dialog = Dialog;
ContractType.Display = Display;
ContractType.List = List;
ContractType.Info = Info;

export default ContractType;
