import { IAdjustment, IBillState, ITransaction } from "./types";

export interface IDisplayableBill {
    description: string;
    total: string;
    totalShares: string;
    totalSharesExceedsTotal: boolean;
    participants: { name: string; share: string, total: string, id: string }[]
}
export const calculateBillShares = (billState: IBillState): IDisplayableBill | null => {
    const { description, total, participants, transactions } = billState;
    if (!total) {
        return null;
    }

    const displayableParticipants = Object.values(participants).map(p => {
        const personShare: number = transactions
            .reduce((acc, t) => acc + t.participants.reduce(
                (acc, curr) => curr.personId === p.id ? (curr.adjustPercentage * t.amount) : acc,
                0),
            0);
        return {
            name: p.name,
            id: p.id,
            share: personShare,
        };
    });
    const add = (a: number, b: number) => a + b;
    const totalShares: number = displayableParticipants.map(p => p.share).reduce(add, 0);

    return {
        description,
        total: total.toFixed(2),
        totalShares: totalShares.toFixed(2),
        totalSharesExceedsTotal: totalShares > total,
        participants: displayableParticipants.map(p => {
            return {
                ...p,
                share: p.share.toFixed(2),
                total: ((p.share / totalShares) * total).toFixed(2)
            }
        })
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