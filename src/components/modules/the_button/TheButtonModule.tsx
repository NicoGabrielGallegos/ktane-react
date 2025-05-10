import React, { useRef, useState } from "react";
import "../../Module.css"
import "./TheButtonModule.css"
import { getBatteries } from "../../widgets/batteries/BatteriesController.tsx";
import { getIndicators } from "../../widgets/indicators/IndicatorsController.tsx";

const TEXT = ["Abortar", "Detonar", "Mantener", "Presionar"]
const [ABORT, DETONATE, HOLD, PRESS] = [0, 1, 2, 3]
const COLORS = ["none", "yellow", "red", "blue", "white"]
const [NONE, YELLOW, RED, BLUE, WHITE] = [0, 1, 2, 3, 5]
const [LIT, UNLIT] = [true, false]
const defaultText = TEXT[0]
const defaultColor = 1
const defaultStrip = 0


export default function TheButtonModule({text = defaultText, color = defaultColor, strip = defaultStrip, ref}: {text?: string, color?: number, strip?: number, ref?}) {
    
    
    return (
        <>
            <div className="module the-button-module" ref={ref}>
                <div className={"the-button the-button-" + COLORS[color]}>
                    <div className="the-button-text">
                        {text}
                    </div>
                </div>
                <div className={"colored-strip colored-strip-" + COLORS[strip]}></div>
            </div>
        </>
    )
}

export function TheButtonModuleSolver({initialText = defaultText, initialColor = defaultColor, initialStrip = defaultStrip}: {initialText?: string, initialColor?: number, initialStrip?: number}) {
    const [text, setText] = useState(initialText)
    const [color, setColor] = useState(initialColor)
    const [strip, setStrip] = useState(initialStrip)
    let moduleRef = useRef(null)

    const checkStrip = (): string => {
        switch (strip) {
            case NONE:
                return "selecciona el color de la banda";
            case BLUE:
                return "4 en cualquier posición del timer";
            case YELLOW:
                return "5 en cualquier posición del timer";
            default:
                return "1 en cualquier posición del timer";
        }
    }

    const solve = (): string => {
        if (color === RED && text === TEXT[HOLD] || getBatteries().getTotal() >= 2 && text == TEXT[DETONATE]) {
            if (strip !== 0) {
                setStrip(0)
            }
            return "Presionar y soltar"
        } else if (color === BLUE && text === TEXT[ABORT] || getIndicators().has("CAR", LIT) && color === WHITE) {
            return "Mantener"
        } else if (getBatteries().getTotal() >= 3 && getIndicators().has("FRK", LIT)) {
            if (strip !== 0) {
                setStrip(0)
            }
            return "Presionar y soltar"
        } else {
            return "Mantener"
        }
    }

    let activeStrip = (solve() === "Mantener")

    return (
        <div className="solver-context the-button-solver-context">
            <div className="solver the-button-solver">
                <div className="text-radio-group">
                    Texto
                    {TEXT.map((t, index) => (
                        <label className="text-radio-label" key={index}> {t}
                            <input defaultChecked={t === text} type="radio" name="text" className="text-radio" onClick={() => setText(t)} />
                        </label>
                    ))}
                </div>
                <div className="the-button-radio-group">
                    Botón
                    {COLORS.map((c, index) => {
                        if (index !== 0) {
                            return <input defaultChecked={index === color} type="radio" name="the-button" className={"the-button-radio radio-" + c} key={index} onClick={() => setColor(index)} />
                        }
                    })}
                </div>
                {activeStrip && (
                    <div className="strip-radio-group">
                        Banda
                        {COLORS.map((s, index) => (
                            <input defaultChecked={index === strip} type="radio" name="strip" className={"strip-radio radio-" + s} key={index} onClick={() => setStrip(index)} />
                        ))}
                    </div>
                )}
                <button className="solver-button the-button-solver-button">Completar</button>
                <p className="the-button-solution">
                    {solve() + (activeStrip ? (": " + checkStrip()) : "")}
                </p>
            </div>
            <TheButtonModule text={text} color={color} strip={strip} ref={moduleRef} />
        </div>
    )
}