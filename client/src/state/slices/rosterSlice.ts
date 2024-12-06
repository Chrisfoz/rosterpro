import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RosterMember {
  id: number;
  name: string;
  roles: string[];
  status: 'confirmed' | 'pending' | 'unavailable';
}

interface RosterAssignment {
  roleId: string;
  memberId: number;
  status: 'confirmed' | 'pending' | 'unavailable';
}

interface RosterState {
  selectedDate: string | null;
  selectedService: 'english' | 'italian';
  assignments: Record<string, RosterAssignment>;
  conflicts: string[];
  isDirty: boolean;
}

const initialState: RosterState = {
  selectedDate: null,
  selectedService: 'english',
  assignments: {},
  conflicts: [],
  isDirty: false,
};

const rosterSlice = createSlice({
  name: 'roster',
  initialState,
  reducers: {
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    setSelectedService(state, action: PayloadAction<'english' | 'italian'>) {
      state.selectedService = action.payload;
    },
    assignMember(state, action: PayloadAction<RosterAssignment>) {
      state.assignments[action.payload.roleId] = action.payload;
      state.isDirty = true;
    },
    unassignMember(state, action: PayloadAction<string>) {
      delete state.assignments[action.payload];
      state.isDirty = true;
    },
    addConflict(state, action: PayloadAction<string>) {
      state.conflicts.push(action.payload);
    },
    clearConflicts(state) {
      state.conflicts = [];
    },
    saveRoster(state) {
      state.isDirty = false;
    },
  },
});

export const {
  setSelectedDate,
  setSelectedService,
  assignMember,
  unassignMember,
  addConflict,
  clearConflicts,
  saveRoster,
} = rosterSlice.actions;

export default rosterSlice.reducer;