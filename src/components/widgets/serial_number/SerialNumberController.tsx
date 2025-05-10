import React, { RefObject, useRef, useState } from "react";
import "./SerialNumber.css";

const vanilla_serial_number = "AAAAA0"

export function getSerialNumber() {
    let serialNumber = {
        value: sessionStorage.getItem("serialNumber") || vanilla_serial_number,
        isEven() {return parseInt(this.value[5])%2 == 0},
        isOdd() {return !this.isEven()},
    }
    return serialNumber
}

export default function SerialNumberController({serialNumber = vanilla_serial_number}: {serialNumber: string}) {
    const [_serialNumber, setSerialNumber] = useState(serialNumber)
    const [textInput, setTextInput] = useState("")

    const updateSerialNumber = () => {
        if (textInput.length === 6 && textInput.match(/[a-z0-9]{5}[0-9]/i)) {
            setSerialNumber(textInput)
            updateStorage(textInput)
        }
    }

    const updateStorage = (serialNumber: string) => {
        sessionStorage.setItem("serialNumber", serialNumber)
    }

    return (
        <>
            <div className="serial-number-container">
                <div className="serial-number-title">
                    Serial Number
                </div>
                <div className="serial-number">
                    <div className="serial-number-text">
                        {_serialNumber}
                    </div>
                    <input type="text" className="serial-number-text-input" onChange={e => setTextInput(e.target.value)} maxLength={6} />
                    <button className="serial-number-button serial-number-update" onClick={updateSerialNumber}>U</button>     
                </div>
            </div>
        </>
    )
}