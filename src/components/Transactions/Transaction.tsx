const Transactions = ({ transactions }: { transactions: any[] }) => {

    return <div>
        <div className="transactions-title">Transactions</div>
        <div className="column-wrapper">
            <div>TYPE</div>
            <div>HASH</div>
            <div>COIN</div>
            <div>AMOUNT</div>
        </div>
        {
            transactions.map((transaction: any) => <div key={transaction.id} className="column-wrapper" >
                <div>{transaction.type}</div>
                <div>{transaction.hash}</div>
                <div>{transaction.coin}</div>
                <div>{transaction.amount}</div>
            </div>)
        }
    </div>
}

export default Transactions;