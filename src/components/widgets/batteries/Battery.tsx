import React, { RefObject, useImperativeHandle, useState } from "react";
import "./Battery.css";

export default function Battery({batteryObject, onQuantityChange, ref}: {batteryObject:{type: string, quantity: number}, onQuantityChange, ref: any}) {
    const [quantity, setQuantity] = useState(batteryObject.quantity)

    const addQuantity = (delta: number) => {
        setQuantity((q) => {
            let new_q
            if (q + delta > -1 && q + delta < 100) {
                batteryObject.quantity = q + delta
                new_q = q + delta
            } else {
                batteryObject.quantity = q
                new_q = q
            }
            onQuantityChange(new_q)
            return new_q
        })
    }

    useImperativeHandle(ref, () => {
        return {
            quantity,
        }
    })

    return (
        <>
            <div className="battery" ref={ref}>
                <span className="battery-type">{batteryObject.type}:</span>
                <span className="battery-quantity">{batteryObject.quantity}</span>
                <button className="battery-button battery-sub" onClick={() => addQuantity(-1)}>-</button>
                <button className="battery-button battery-add" onClick={() => addQuantity(1)}>+</button>
            </div>
        </>
    )
}