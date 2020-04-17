import Transaction from '../models/Transaction';

interface createTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { transactions } = this;

    const totalIncome = transactions.reduce(
      (total, income) =>
        income.type === 'income' ? total + income.value : total + 0,
      0,
    );

    const totalOutcome = transactions.reduce(
      (total, outcome) =>
        outcome.type === 'outcome' ? total + outcome.value : total + 0,
      0,
    );

    const data = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return data;
  }

  public create({ title, value, type }: createTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    const avaiableTotal = this.getBalance();

    if (type === 'outcome' && avaiableTotal.total < value) {
      throw Error('No limit');
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
