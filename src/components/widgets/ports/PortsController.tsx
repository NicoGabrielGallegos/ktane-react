import React, { RefObject, useRef } from "react";
import "./Port.css";
import Port from "./Port.tsx";

const vanilla_ports = [
    {type: "DVI-I", quantity: 0},
    {type: "Parallel", quantity: 0},
    {type: "PS/2", quantity: 0},
    {type: "RJ-45", quantity: 0},
    {type: "Serial", quantity: 0},
    {type: "Stereo RCA", quantity: 0},
  ]

export default function PortsController({ports = vanilla_ports}: {ports: Array<{type: string, quantity: number}> }) {
    const portsRef: RefObject<any>[] = []
    for (let i = 0; i <= ports.length; i++) {
        portsRef.push(useRef(null))
    }

    const changePortQuantity = (index: number, quantity: number) => {
        ports[index].quantity = quantity
        updateStorage(ports)
    }

    const updateStorage = (ports: {type: string, quantity: number}[]) => {
        sessionStorage.setItem("ports", JSON.stringify(ports))
    }

    return (
        <>
            <div className="ports-container">
                <div className="port-title">
                    Ports
                </div>
                {ports.map((port, index) => (
                    <Port portObject={port} onQuantityChange={(quantity) => changePortQuantity(index, quantity)} ref={portsRef[index]} key={index} />
                ))}       
            </div>
        </>
    )
}