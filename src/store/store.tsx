import { create } from 'zustand';
import { createUserSlice } from './createUserSlice';

const Store = create(createUserSlice);

export default Store;