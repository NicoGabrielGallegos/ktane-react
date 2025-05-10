import React, { RefObject, useEffect, useImperativeHandle, useState } from "react";
import "./Indicator.css";

export default function Indicator({indicatorObject, onRemove, onLightSwitch, ref}: {indicatorObject: {text: string, light: boolean}, onRemove, onLightSwitch, ref: any}) {
    const [isLit, setLit] = useState(indicatorObject.light)

    const switchLight = (new_light) => {
        onLightSwitch(new_light)
        setLit(new_light)
    }
    
    useImperativeHandle(ref, () => {
        return {
            switchLight,
            isLit,
        }
    })

    return (
        <>
            <div className="indicator" ref={ref}>
                <span className="indicator-text">{indicatorObject.text}:</span>
                <span className="indicator-light">{indicatorObject.light ? "Lit" : "Unlit"}</span>
                <button className={"indicator-button indicator-switch " + (indicatorObject.light ? "lit" : "unlit")} onClick={() => switchLight(!indicatorObject.light)}>S</button>
                <button className="indicator-button indicator-delete" onClick={onRemove}>X</button>
            </div>
        </>
    )
}