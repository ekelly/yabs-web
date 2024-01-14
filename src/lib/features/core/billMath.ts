import { IAdjustment, IBillState, ITransaction } from "./types";

export const getTotalInDollars = (state: { total: number }): number => { 
    return state.total / 100;
};

export interface IDisplayableBill {
    description: string;
    total: number;
    participants: { name: string; share: number, id: string }[]
}
export const calculateBillShares = (billState: IBillState) => {
    const { description, total, participants, transactions } = billState;
    if (!total) {
        return null;
    }

    const displayableParticipants = Object.values(participants).map(p => {
        const personShare = transactions
            .reduce((acc, t) => acc + t.participants.reduce(
                (acc, curr) => curr.personId === p.id ? (curr.adjustPercentage * t.amount) : acc,
                0),
            0);
        return {
            name: p.name,
            id: p.id,
            share: personShare
        };
    });

    return {
        description,
        total,
        participants: displayableParticipants
    };
}

export const adjustTransactionPercentages = (transaction: ITransaction, participantToRemove: string): ITransaction => {
    const adjustmentToRemove = transaction.participants.find(adjustment => adjustment.personId === participantToRemove);
    const numberOfParticipants = transaction.participants.length - 1;
    if (adjustmentToRemove && transaction.participants) {
        const percentageToAddToEachOtherParticipant = adjustmentToRemove.adjustPercentage / numberOfParticipants;
        const updatedParticipants: IAdjustment[] = transaction.participants.reduce((acc: IAdjustment[], a: IAdjustment) => {
            if (a.personId === participantToRemove) {
                return acc;
            } else {
                return [...acc, {
                    ...a,
                    adjustPercentage: a.adjustPercentage + percentageToAddToEachOtherParticipant
                }];
            }
        }, []);
        return {
            ...transaction,
            participants: updatedParticipants
        }
    } else {
        return transaction;
    }
};