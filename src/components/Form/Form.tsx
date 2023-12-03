import { useState } from "react";

const Form = ({ handleCreate }: { handleCreate: Function }) => {
    const [operation, setOperation] = useState('deposit');
    const [value, setValue] = useState('0');

    const createContract = () => {
        let numValue = Number(value);
        if (isNaN(numValue) || numValue === 0) {
            alert('Wrong value');
            return false;
        }
        let obj = {
            type: operation,
            amount: numValue
        }
        handleCreate(obj);
        setValue('0')
    }



    return <div className="form-wrapper" >
        <div>
            <div className="btns-wrapper" >
                <button onClick={() => setOperation('deposit')} className={operation === 'deposit' ? 'active blue-btn' : '' + "blue-btn"} >DEPOSIT</button>
                <button onClick={() => setOperation('withdraw')} className={operation === 'withdraw' ? 'active blue-btn' : '' + "blue-btn"}>WITHDRAW</button>
            </div>
            <div className="currency-wrapper" >
                <div>ETH</div>
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div className="confirm-wrapper" >
                <button onClick={createContract} className="active blue-btn" >CONFIRM</button>
            </div>
        </div>
    </div>
}

export default Form;