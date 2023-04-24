import { createContext } from 'react';
import type { TStores } from '../types';

const StoreContext = createContext<TStores | null>(null);

export default StoreContext;
