import React, { useState, useRef, useEffect } from "react";
import { BackspaceRounded, ArrowUpwardRounded, IcRoundPlusMinusAlt } from "./Icons"

function SingleChoice({ options, initialValue = 1, min = -Infinity, max = Infinity, onChange, ...props }) {
    const [bValue, setValue] = useState(initialValue);
    const [showKeyboard, setShowKeyboard] = useState(false);

    useEffect(() => {
        if (onChange) {
            onChange(bValue);
        }
    }, [bValue, onChange]);

    const handleDoubleClick = () => {
        setShowKeyboard(true);
    };

    const handleKeyboardInput = (newValue) => {
        console.log(newValue)
        setValue(newValue)
    }

    return (
        <div {...props} className="flex flex-col items-center w-[144px] px-[4px] bg-white">
            <div
                onClick={handleDoubleClick}
                className="cursor-pointer w-full px-[4px] text-center border rounded-md h-7"
            >
                <p
                    // type="text"
                    // value={options.reduce((r, e, i) => {
                    // return r + (bValue.includes(i) ? (e + ",") : "")
                    // }, "")}
                    readOnly
                    className="jx1 w-full text-center outline-none rounded-md h-6 truncate"
                >
                    {options[bValue]}
                </p>
            </div>
            {showKeyboard && (
                <CustomKeyboard
                    options={options}
                    onChange={handleKeyboardInput}
                    initialValue={bValue}
                    done={() => {
                        setShowKeyboard(false);
                    }}
                />
            )}
        </div>
    );
}

function CustomKeyboard({ options, onChange, done, initialValue }) {
    const [localValue, setLocalValue] = useState(initialValue);

    const handleButtonClick = (btnIndex, e) => {
        console.log(btnIndex, e)
        setLocalValue(btnIndex)
    };

    useEffect(() => {
        onChange(localValue);
    }, [localValue, onChange]);

    const handleSubmit = () => {
        done()
    };

    const advanceClass = (i) => {
        if (localValue === i) {
            return "bg-slate-200"
        }
        return ""
    }

    return (
        <div className="z-10 bg-white bg-opacity-95 absolute custom-keyboard mt-[30px]">
            <div className="grid grid-cols-4">
                {options.map((num, index) => (
                    <button
                        key={num + "" + index}
                        id={`button-${index}-${num}`}
                        className={`m-[0.1rem] rounded-md border w-8 h-8 ${advanceClass(index)}`}
                        onClick={(e) => handleButtonClick(index, e)}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <button
                id={`button-done`}
                className={`mt-1 rounded-md border w-[136px] h-8`}
                onClick={handleSubmit}
            >
                <ArrowUpwardRounded className="w-[136px] h-5" />
            </button>
        </div>
    );
}

export default SingleChoice;