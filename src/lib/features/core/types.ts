
export interface IBillState {
    id: string; // An identifier corresponding to this bill
    description: string;
    total?: number; // The total cost of the bill, including tax & tip in pennies
    participants: Record<PersonId, IPerson>; // The people involved in the bill splitting
    transactions: Array<ITransaction>; // The list of transactions
}

export type PersonId = string;
export interface IPerson {
    name: string; // Human readable, for keeping track of who is who
    share?: number; // The proportion of the bill which is due to this person, "in pennies"
    id: PersonId; // For internal tracking purposes
}

export interface IPersonContribution {
    id: string; // For internal tracking purposes
    name: string; // Human readable, for keeping track of who is who
    personTotal: number; // The amount of $$ that this person must contribute to the bill
}

export interface ITransaction {
    id: TransactionId; // Identifier for the transaction
    amount: number; // The cost that is split among all the participants
    participants: Array<IAdjustment>;
}

export interface IAdjustment {
    personId: PersonId; // Identifier of the person being adjusted
    adjustPercentage: number; // Percentage of the transaction associated with this person
}

export type TransactionId = string;

export type TotalContributionsList = Array<IPersonContribution>;