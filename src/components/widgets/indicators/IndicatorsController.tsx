import React, { RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./Indicator.css";
import Indicator from "./Indicator.tsx";

const vanilla_indicators = []

export function getIndicators() {
    let indicators: {
        value: {text: string, light: boolean}[],
        has(text: string, light: boolean): boolean
    } = {
        value: JSON.parse(sessionStorage.getItem("indicators") || JSON.stringify(vanilla_indicators)),
        has(text, light) {
            this.value.forEach(indicator => {
                if (indicator.text === text && indicator.light === light) {
                    return true
                }
            });
            return false
        }
    }
    return indicators
}

export function IndicatorCreator({parentRef}: {parentRef: RefObject<any>}) {
    const [textInput, setTextInput] = useState("")
    const [lightSelect, setLightSelect] = useState(false)
    
    const createIndicator = () => {
        if (textInput.length === 3) {
            let new_indicator = {
                text: textInput,
                light: lightSelect,
            }
            parentRef.current?.addIndicator(new_indicator)
        }
    }

    return (
        <>
            <div className="indicator-creator">
                <input type="text" className="indicator-text-input" onChange={e => setTextInput(e.target.value)} maxLength={3} />
                <select className="indicator-light-select" defaultValue={0} onChange={e => setLightSelect(Boolean(parseInt(e.target.value)))}>
                    <option value={0}>Unlit</option>
                    <option value={1}>Lit</option>
                </select>
                <button className="indicator-button indicator-create" onClick={createIndicator}>+</button>
            </div>
        </>
    )
}

export default function IndicatorsController({indicators = vanilla_indicators}: {indicators: Array<{text: string, light: boolean}> }) {
    const indicatorsRef: RefObject<any[]> = useRef([])
    const [_indicators, setIndicators] = useState(indicators)
    let indicatorControllerRef: RefObject<any> = useRef<any>(null)

    const removeIndicator = (index: number) => {
        let new_indicators = [..._indicators]
        new_indicators.splice(index, 1)
        setIndicators(new_indicators)
        updateStorage(new_indicators)
    }

    const addIndicator = (indicator: {text: string, light: boolean}) => {
        let new_indicators = [..._indicators]
        new_indicators.push(indicator)
        setIndicators(new_indicators)
        updateStorage(new_indicators)
    }

    const switchIndicatorLight = (index: number, light: boolean) => {
        _indicators[index].light = light
        setIndicators(_indicators)
        updateStorage(_indicators)
    }

    const updateStorage = (indicators: {text: string, light: boolean}[]) => {
        sessionStorage.setItem("indicators", JSON.stringify(indicators))
    }

    useEffect(() => {
        indicatorsRef.current?.forEach((ref, index) => {
            ref?.switchLight(_indicators[index].light)
        })
    }, [_indicators])

    useImperativeHandle(indicatorControllerRef, () => {
        return {
            _indicators,
            addIndicator,
        }
    })

    return (
        <>
            <div className="indicators-container" ref={indicatorControllerRef}>
                <div className="indicator-title">
                    Indicators
                </div>
                {_indicators.map((indicator, index) => (
                    <Indicator indicatorObject={indicator} onRemove={() => removeIndicator(index)} onLightSwitch={(light: boolean) => switchIndicatorLight(index, light)} ref={(e) => indicatorsRef.current[index] = e} key={index} />
                ))}       
                <IndicatorCreator parentRef={indicatorControllerRef} />
            </div>
        </>
    )
}