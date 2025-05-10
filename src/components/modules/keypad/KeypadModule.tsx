import React, { useRef, useState } from "react";
import "../../Module.css"
import "./KeypadModule.css"

const SYMBOLS = [" ", "©", "★", "☆", "ټ", "Җ", "Ω", "Ѭ", "ὦ", "ϗ", "б", "Ϟ", "Ѧ", "æ", "Ԇ", "Ӭ", "Ҋ", "Ѯ", "¿", "¶", "Ͼ", "Ͽ", "Ψ", "Ҩ", "҂", "Ϙ", "ƛ", "ѣ"]
const [
    EMPTY, COPYRIGHT, FILLED_STAR, HOLLOW_STAR, SMILEY_FACE, DOUBLE_K, OMEGA, SQUID_KNIFE, PUMPKIN, HOOK_N, SIX, SQUIGGLY_N, AT, AE, MELTED_THREE,
    EURO, N_WITH_HAT, DRAGON, QUESTION_MARK, PARAGRAPH, RIGHT_C, LEFT_C, PITCHFORK, CURSIVE, TRACKS, BALLOON, UPSIDE_DOWN_Y, BT
] = SYMBOLS

const defaultSymbols = {
    up_left: EMPTY,
    up_right: EMPTY,
    down_left: EMPTY,
    down_right: EMPTY
}


export default function KeypadModule({symbols = defaultSymbols, ref}: {symbols?: {up_left: string, up_right: string, down_left: string, down_right: string}, ref?}) {
    return (
        <div className="module keypad-module" ref={ref}>
            <div className="symbol symbol-up-left">{symbols?.up_left || EMPTY}</div>
            <div className="symbol symbol-up-right">{symbols?.up_right || EMPTY}</div>
            <div className="symbol symbol-down-left">{symbols?.down_left || EMPTY}</div>
            <div className="symbol symbol-down-right">{symbols?.down_right || EMPTY}</div>
        </div>
    )
}

export function KeypadModuleSolver({initialSymbols = defaultSymbols}: {initialSymbols?: {up_left: string, up_right: string, down_left: string, down_right: string}}) {
    const [symbols, setSymbols] = useState(initialSymbols)
    const [valid_columns, setValidColumn] = useState([true, true, true, true, true, true])
    let moduleRef = useRef(null)
    const SYMBOL_COLUMNS = [
        [BALLOON, AT, UPSIDE_DOWN_Y, SQUIGGLY_N, SQUID_KNIFE, HOOK_N, LEFT_C],
        [EURO, BALLOON, LEFT_C, CURSIVE, HOLLOW_STAR, HOOK_N, QUESTION_MARK],
        [COPYRIGHT, PUMPKIN, CURSIVE, DOUBLE_K, MELTED_THREE, UPSIDE_DOWN_Y, HOLLOW_STAR],
        [SIX, PARAGRAPH, BT, SQUID_KNIFE, DOUBLE_K, QUESTION_MARK, SMILEY_FACE],
        [PITCHFORK, SMILEY_FACE, BT, RIGHT_C, PARAGRAPH, DRAGON, FILLED_STAR],
        [SIX, EURO, TRACKS, AE, PITCHFORK, N_WITH_HAT, OMEGA],
    ]

    const handleSymbolClick = (symbol: string) => {
        let new_symbols = {...symbols}
        if (Object.values(new_symbols).findIndex(e => e === symbol) === -1) {
            if (Object.values(new_symbols).findIndex(e => e === EMPTY) !== -1) {
                for (let key of Object.keys(new_symbols)) {
                    if (new_symbols[key] === EMPTY) {
                        new_symbols[key] = symbol
                        break
                    }
                }
            } else return
        } else {
            for (let key of Object.keys(new_symbols)) {
                if (new_symbols[key] === symbol) {
                    new_symbols[key] = EMPTY
                    break
                }
            }
        }
        calcValidColumns(new_symbols)
        setSymbols(new_symbols)
    }

    const calcValidColumns = (new_symbols: {up_left: string, up_right: string, down_left: string, down_right: string}) => {
        let new_valid_columns = [true, true, true, true, true, true]
        for (let value of Object.values(new_symbols)) {
            if (value !== EMPTY) {
                SYMBOL_COLUMNS.forEach((column, index) => {
                    if (!column.includes(value)) {
                        new_valid_columns[index] = false
                    }
                })
            } else continue
        }
        
        setValidColumn(new_valid_columns)
        console.log(new_valid_columns);
    }

    return (
        <div className="solver-context keypad-solver-context">
            <div className="solver keypad-solver">
                <div className="solver-symbol-columns">
                    {SYMBOL_COLUMNS.map((column, columnIndex) => (
                        <div className="solver-symbol-column" key={columnIndex}>
                            {column.map((symbol, symbolIndex) => (
                                <button className={"solver-symbol" + (valid_columns[columnIndex] ? (Object.values(symbols).includes(symbol) ? " solver-symbol-selected" : "") : " solver-symbol-invalid")} key={symbolIndex} onClick={() => valid_columns[columnIndex] && handleSymbolClick(symbol)}>{symbol}</button>
                            ))}
                        </div>
                    ))}
                </div>
                <button className="solver-button keypad-solver-button">Completar</button>
            </div>
            <KeypadModule symbols={symbols} ref={moduleRef} />
        </div>
    )
}