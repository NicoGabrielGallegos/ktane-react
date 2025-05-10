import React, { RefObject, useImperativeHandle, useState } from "react";
import "./Port.css";

export default function Port({portObject, onQuantityChange, ref}: {portObject: {type: string, quantity: number}, onQuantityChange, ref: RefObject<any>}) {
    const [quantity, setQuantity] = useState(portObject.quantity)

    const addQuantity = (delta: number) => {
        setQuantity((q) => {
            let new_q
            if (q + delta > -1 && q + delta < 100) {
                portObject.quantity = q + delta
                new_q = q + delta
            } else {
                portObject.quantity = q
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
            <div className="port" ref={ref}>
                <span className="port-type">{portObject.type}:</span>
                <span className="port-quantity">{portObject.quantity}</span>
                <button className="port-button port-sub" onClick={() => addQuantity(-1)}>-</button>
                <button className="port-button port-add" onClick={() => addQuantity(1)}>+</button>
            </div>
        </>
    )
}