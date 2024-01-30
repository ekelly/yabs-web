"use client";

import { IAdjustment, IBillState, ITransaction } from "./types";

export type IDisplayableBill = {
  description: string;
  total: string;
  totalShares: string;
  totalSharesExceedsTotal: boolean;
  participants: { name: string; share: string; total: string; id: string }[];
};

/**
 * Calculates displayable values from the bill state.
 */
export const calculateBillShares = (
  billState: IBillState
): IDisplayableBill | null => {
  const { description, total, participants, transactions } = billState;
  if (!total) {
    return null;
  }

  const displayableParticipants = Object.values(participants).map((p) => {
    const personShare: number = transactions.reduce(
      (acc, t) =>
        acc +
        t.participants.reduce(
          (acc, curr) =>
            curr.personId === p.id ? curr.adjustPercentage * t.amount : acc,
          0
        ),
      0
    );
    return {
      name: p.name,
      id: p.id,
      share: personShare,
    };
  });
  const add = (a: number, b: number) => a + b;
  const totalShares: number = displayableParticipants
    .map((p) => p.share)
    .reduce(add, 0);

  return {
    description,
    total: total.toFixed(2),
    totalShares: totalShares.toFixed(2),
    totalSharesExceedsTotal: totalShares > total,
    participants: displayableParticipants.map((p) => {
      return {
        ...p,
        share: p.share.toFixed(2),
        total: ((p.share / totalShares) * total).toFixed(2),
      };
    }),
  };
};

/**
 * When removing a participant from a transaction, all other
 * participants within the transaction need their % of the transaction
 * updated so that the percentage adds up to 100%
 * @param transaction The transaction to modify
 * @param participantToRemove The ID of the participant to remove
 * @returns Updated Transaction
 */
export const adjustTransactionPercentagesAfterRemovingParticipant = (
  transaction: ITransaction,
  participantToRemove: string
): ITransaction => {
  const adjustmentToRemove = transaction.participants.find(
    (adjustment) => adjustment.personId === participantToRemove
  );
  const numberOfParticipants = transaction.participants.length - 1;
  if (adjustmentToRemove && transaction.participants) {
    const percentageToAddToEachOtherParticipant =
      adjustmentToRemove.adjustPercentage / numberOfParticipants;
    const updatedParticipants: IAdjustment[] = transaction.participants.reduce(
      (acc: IAdjustment[], a: IAdjustment) => {
        if (a.personId === participantToRemove) {
          return acc;
        } else {
          return [
            ...acc,
            {
              ...a,
              adjustPercentage:
                a.adjustPercentage + percentageToAddToEachOtherParticipant,
            },
          ];
        }
      },
      []
    );
    return {
      ...transaction,
      participants: updatedParticipants,
    };
  } else {
    return transaction;
  }
};

export type IPersonTotals = {
  [key: string]: {
    id: string;
    name: string;
    total: number;
  };
};

/**
 * Calculates the total per person from the bill state.
 */
export const calculatePersonTotals = (billState: IBillState): IPersonTotals => {
  return Object.values(billState.participants)
    .map((p) => {
      const personShare: number = billState.transactions.reduce(
        (acc, t) =>
          acc +
          t.participants.reduce(
            (acc, curr) =>
              curr.personId === p.id ? curr.adjustPercentage * t.amount : acc,
            0
          ),
        0
      );
      return {
        name: p.name,
        id: p.id,
        total: personShare,
      };
    })
    .reduce(
      (acc: IPersonTotals, pt: { name: string; id: string; total: number }) => {
        return { ...acc, [pt.id]: pt };
      },
      {}
    );
};
