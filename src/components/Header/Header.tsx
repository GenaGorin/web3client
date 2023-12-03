import React from 'react';

const Header = ({ connect, adress, balance }: { connect: React.MouseEventHandler<HTMLButtonElement>, adress: string, balance: any }) => {


    return <div className="header">
        <a href='#'>
            Addiction Bets
        </a>
        {adress
            ? <div className='account-wrapper'>
                <button className="pink-button">
                    ...{adress.slice(-15)}
                </button>
                <small>Balance - {balance}</small>
            </div>
            :
            <button onClick={connect} className="pink-button">
                CONNECT WALLET
            </button>
        }
    </div>
}

export default Header;