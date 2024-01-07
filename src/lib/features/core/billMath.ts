
export const getTotalInDollars = (state: { total: number }): number => { 
    return state.total / 100;
};
