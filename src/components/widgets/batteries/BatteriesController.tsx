import React, { RefObject, useRef } from "react";
import "./Battery.css";
import Battery from "./Battery.tsx";

const vanilla_batteries = [
    {type: "AA", quantity: 0},
    {type: "D", quantity: 0},
]

export function getBatteries() {
    let batteries: {
        value: {type: string, quantity: number}[]
        getTotal(): number
    } = {
        value: JSON.parse(sessionStorage.getItem("batteries") || JSON.stringify(vanilla_batteries)),
        getTotal() {
            let count = 0
            for (let i = 0; i < this.value.length; i++) {
                count += this.value[i].quantity
                
            }
            return count
        }
    }
    return batteries
}

export default function BatteriesController({batteries = vanilla_batteries}: {batteries: Array<{type: string, quantity: number}>}) {
    const batteriesRef: RefObject<any[]> = useRef([])

    const changeBatteryQuantity = (index: number, quantity: number) => {
        batteries[index].quantity = quantity
        updateStorage(batteries)
    }

    const updateStorage = (batteries: {type: string, quantity: number}[]) => {
        sessionStorage.setItem("batteries", JSON.stringify(batteries))
    }

    return (
        <>
            <div className="batteries-container">
                <div className="battery-title">
                    Batteries
                </div>
                {batteries.map((battery, index) => (
                    <Battery batteryObject={battery} onQuantityChange={(quantity) => changeBatteryQuantity(index, quantity)} ref={e => batteriesRef[index] = e} key={index} />
                ))}       
            </div>
        </>
    )
}