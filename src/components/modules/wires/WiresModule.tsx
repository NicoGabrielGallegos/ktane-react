import React, { RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import "../../Module.css"
import "./WiresModule.css"
import { getSerialNumber } from "../../widgets/serial_number/SerialNumberController.tsx";

const wireColorsClasses = ["none", "yellow", "red", "blue", "black", "white"]
const vanillaDefaultWires = [0, 0, 0, 0, 0, 0]
const [NONE, YELLOW, RED, BLUE, BLACK, WHITE] = [0, 1, 2, 3, 4, 5]

export function Wire({index, leftSupport, rightSupport, wireColor, ref}: {index: number, leftSupport: Element, rightSupport: Element, wireColor: number, ref?}) {
    const [color, setColor] = useState(wireColor)

    let p = leftSupport.getBoundingClientRect()
    let q = rightSupport.getBoundingClientRect()
    //console.log(p);
    
    let x = q.left-p.left + p.width/2 + 3
    let y = q.top-p.top
    //console.log(x);
    //console.log(y);

    let width = Math.sqrt(x*x + y*y) + "px"
    let marginLeft = 56 + "px"
    let marginTop = 40 + 60 * index + "px"
    let transform = "rotate(" + (Math.atan2(q.y-p.y, q.x-p.x) * 180 / Math.PI) + "deg)"

    useImperativeHandle(ref, () => {
        return {
            setColor,
        }
    })

    return (
        <div className={"wire wire-" + index + " wire-" + wireColorsClasses[color]} id={"wire-" + index} key={index} style={{marginLeft, marginTop, width, transform}} ref={ref}></div>
    )
}

export default function WiresModule({wires = vanillaDefaultWires, ref, wireRefs}: {wires?: number[], ref?, wireRefs?}) {
    const [wireElements, setWireElements] = useState<React.JSX.Element[]>([])
    let doOnce = true

    const createWire = (index: number, leftSupport: Element, rightSupport: Element, wireColor: number) => {
        /*console.log("Wire:");
        console.log(wire);
        
        console.log("Left Support:");
        console.log(leftSupport);
        
        console.log("Right Support:");
        console.log(rightSupport);
        
        console.log("Wire Color:" + wireColor);*/

        let p = leftSupport.getBoundingClientRect()
        let q = rightSupport.getBoundingClientRect()
        //console.log(p);
        
        let x = q.left-p.left + p.width/2 + 3
        let y = q.top-p.top
        //console.log(x);
        //console.log(y);

        let width = Math.sqrt(x*x + y*y) + "px"
        let marginLeft = 56 + "px"
        let marginTop = 40 + 60 * index + "px"
        let transform = "rotate(" + (Math.atan2(q.y-p.y, q.x-p.x) * 180 / Math.PI) + "deg)"

        return (
            <Wire index={index} leftSupport={leftSupport} rightSupport={rightSupport} key={index} wireColor={wireColor} ref={(e) => wireRefs.current[index] = e} />
        )
    }

    const createWires = () => {
        let leftSupports = document.getElementsByClassName("wires-support-left")[0].children
        let rightSupports = document.getElementsByClassName("wires-support-right")[0].children

        wires.map((wireColor, i) => {
            let new_wire = createWire(i, leftSupports[i], rightSupports[i], wireColor)
            if (new_wire) {
                setWireElements(ws => [...ws, new_wire])
            }
        })
        //console.log(wires);
    }
    
    useEffect(() => {
        if (doOnce) {
            createWires()
            doOnce = false
        }
    }, [])

    return (
        <>
            <div className="module wires-module">
                <div className="wires-support wires-support-left">
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                </div>
                <div className="wires-support wires-support-right">
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                    <div className="wires-connector"></div>
                </div>
                {wires.map((wire, index) => wireElements[index])}
            </div>
        </>
    )
}

export function WiresModuleSolver({defaultWires = vanillaDefaultWires}: {defaultWires?: number[]}) {
    const [wires, setWires] = useState(defaultWires)
    let moduleRef = useRef<any>(null)
    let wireRefs: RefObject<any[]> = useRef([])

    const updateWire = (wireIndex: number, colorIndex: number) => {
        let new_wires = [...wires]
        new_wires[wireIndex] = colorIndex
        setWires(new_wires)
        //console.log(new_wires);

        wireRefs.current[wireIndex].setColor(colorIndex)
        //wireRefs.current?.forEach((ref, index) => ref.setColor(new_wires[index]))         [forall]
    }

    const reducedWires = () => {
        return wires.filter(wireColor => wireColor !== NONE)
    }

    const exactWireCombination = (combination: number[]) => {
        return reducedWires().toString() === combination.toString()
    }

    const countColor = (color: number) => {
        return wires.filter(wireColor => wireColor === color).length
    }

    const hasColorAtLast = (color: number) => {
        return reducedWires()[reducedWires().length-1] === color
    }

    const solve = () => {
        switch (reducedWires().length) {
            case 3:
                if (countColor(RED) === 0 || exactWireCombination([BLUE, BLUE, RED])) {
                    return "Cortar el segundo cable"
                } else {
                    return "Cortar el tercer cable"
                }
            case 4:
                if (countColor(RED) >= 2 && getSerialNumber().isOdd()) {
                    return "Cortar el último cable rojo"
                } else if (hasColorAtLast(YELLOW) && countColor(RED) === 0 || countColor(BLUE) === 1) {
                    return "Cortar el primer cable"
                } else if (countColor(YELLOW) >= 2) {
                    return "Cortar el cuarto cable"
                } else {
                    return "Cortar el segundo cable"
                }
            case 5:
                if (hasColorAtLast(BLACK) && getSerialNumber().isOdd()) {
                    return "Cortar el cuarto cable"
                } else if (countColor(RED) === 1 && countColor(YELLOW) >= 2) {
                    return "Cortar el primer cable"
                } else if (countColor(BLACK) === 0) {
                    return "Cortar el segundo cable"
                } else {
                    return "Cortar el primer cable"
                }
            case 6:
                if (countColor(YELLOW) === 0 && getSerialNumber().isOdd()) {
                    return "Cortar el tercer cable"
                } else if (countColor(YELLOW) === 1 && countColor(WHITE) >= 2) {
                    return "Cortar el cuarto cable"
                } else if (countColor(RED) === 0) {
                    return "Cortar el sexto cable"
                } else {
                    return "Cortar el cuarto cable"
                }
                break;
            default:
                return "Setup incompleto"
        }
    }

    return (
        <div className="solver-context wires-solver-context">
            <div className="solver wires-solver">
                {wires.map((wireColor, wireIndex) => (
                    <div className="wire-radio-group" key={wireIndex}>
                        Cable {wireIndex+1}
                        {wireColorsClasses.map((color, colorIndex) => (
                            <input defaultChecked={wireColor === colorIndex} type="radio" name={"wire" + wireIndex} className={"wire-radio wire-radio-" + color} key={colorIndex} onClick={() => updateWire(wireIndex, colorIndex)} />
                        ))}
                    </div>
                ))}
                <button className="wires-solver-button">Completar</button>
                <p className="wires-solution">
                    {solve()}
                </p>
            </div>
            <WiresModule wires={wires} ref={moduleRef} wireRefs={wireRefs} />
        </div>
    )
}