import React, { useImperativeHandle, useRef, useState } from "react";
import "../../Module.css"
import "./PasswordModule.css"

const vanillaDefaultLetters = ["", "", "", "", ""]
const vanillaDefaultWords = {
    "en": [
        "about", "after", "again", "below", "could",
        "every", "first", "found", "great", "house",
        "large", "learn", "never", "other", "place",
        "plant", "point", "right", "small", "sound",
        "spell", "still", "study", "their", "there",
        "these", "thing", "think", "three", "water",
        "where", "which", "world", "would", "write"
    ],
    "es": [
        "abajo", "altar", "bajar", "bomba", "bueno",
        "cable", "cerca", "corto", "delta", "donde",
        "estar", "falta", "gomas", "grasa", "hogar",
        "hueso", "listo", "lugar", "magia", "miedo",
        "mundo", "nunca", "otros", "pasar", "pasos",
        "perca", "plata", "punto", "queso", "ronda",
        "salto", "suena", "tasar", "traba", "valor"
    ],
}

export default function PasswordModule({defaultLetters = vanillaDefaultLetters, ref}: {defaultLetters?: string[], ref?}) {
    const [displayLetters, setDisplayLetters] = useState<string[]>(defaultLetters.map((letters) => letters[0] || ""))
    const [displayIndexes, setIndexes] = useState<number[]>(defaultLetters.map(() => 0))

    const changeDisplayIndex = (column: number, new_index: number) => {
        //console.log(defaultLetters[column]);
        displayIndexes[column] = new_index % defaultLetters[column].length || 0
        //console.log(displayIndexes)
        setIndexes(displayIndexes)
        setDisplayLetters(defaultLetters.map((letters, column) => letters[displayIndexes[column]] || ""))
    }

    const updateDisplay = () => {
        setDisplayLetters(defaultLetters.map((letters, column) => {
            if (defaultLetters[column].length === 0) {
                displayIndexes[column] = 0
            }
            else if (displayIndexes[column] >= defaultLetters[column].length) {
                displayIndexes[column] = defaultLetters[column].length - 1
            }
            return letters[displayIndexes[column]] || "" //letters[displayIndexes[column] %= defaultLetters[column].length] || ""
        }))
    }

    useImperativeHandle(ref, () => {
        return {
            updateDisplay,
        }
    })

    return (
        <>
            <div className="module password-module">
                <div className="password-display">
                        {displayLetters.map((letter, column) => (
                            <div className="password-letter-column" key={column}>
                                <button className="password-arrow password-arrow-up" onClick={() => changeDisplayIndex(column, displayIndexes[column] + defaultLetters[column].length - 1)}>↑</button>
                                <div className="password-letter">{letter}</div>
                                <button className="password-arrow password-arrow-down" onClick={() => changeDisplayIndex(column, displayIndexes[column] + 1)}>↓</button>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}

export function PasswordModuleSolver({defaultLetters = vanillaDefaultLetters, defaultWords = vanillaDefaultWords["es"]}: {defaultLetters?: string[], defaultWords?: string[]}) {
    const [letters, setLetters] = useState<string[]>(defaultLetters)
    const [validWords, setValidWords] = useState<string[]>(defaultWords)
    let moduleRef = useRef<any>(null)

    const updateLetters = (column: number, new_letters: string) => {
        if (new_letters.match(/^[a-z]*$/i)) {
            letters[column] = [... new Set(new_letters.toLowerCase())].join("")
            setLetters(letters)
            //console.log(letters[column])
            moduleRef.current?.updateDisplay()
            updateValidWords()
        }
    }

    const updateValidWords = () => {
        setValidWords(defaultWords.filter((word, index) => {
            for (let i = 0; i < 5; i++) 
            {
                // if (index === 0) {
                //     console.log(word);
                //     console.log(letters[i]);
                //     console.log(word[i]);
                //     console.log(letters[i].includes(word[i]));
                // }
                
                if (letters[i] === "") {
                    return true
                }
                else if (!letters[i].includes(word[i])) {
                    return false
                }
            }
            return true
        }))
    }

    return (
        <div className="solver-context password-solver-context">
            <div className="solver password-solver">
                {letters.map((letters, column) => (
                    <label key={column}>Col {column+1}: <input type="text" className="password-solver-input" onChange={(e) => {updateLetters(column, e.target.value)}} /></label>
                ))}
                <button className="password-solver-button">Completar</button>
                <p className="password-solution">
                    {validWords.join(", ")}
                </p>
            </div>
            <PasswordModule defaultLetters={letters} ref={moduleRef} />
        </div>
    )
}