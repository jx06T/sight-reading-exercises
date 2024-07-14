import React, { useState, useRef, useEffect } from "react";
import { BackspaceRounded, ArrowUpwardRounded, IcRoundPlusMinusAlt } from "./Icons"

function IntInputBox({ options, initialValue = [1, 2], min = -Infinity, max = Infinity, onChange, ...props }) {
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
                <span
                    // type="text"
                    // value={options.reduce((r, e, i) => {
                    // return r + (bValue.includes(i) ? (e + ",") : "")
                    // }, "")}
                    readOnly
                    className="jx1 w-full text-center outline-none rounded-md h-6 "
                >
                    {options.reduce((r, e, i) => {
                        return r + (bValue.includes(i) ? (e + ",") : "")
                    }, "")}
                </span>
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

    const handleButtonClick = (index) => {
        if (localValue.includes(index)) {
            setLocalValue(prevInput => prevInput.filter(e => e != index));
        } else {
            setLocalValue(prevInput => [...prevInput, index]);
        }
    };

    useEffect(() => {
        onChange(localValue);
    }, [localValue, onChange]);

    const handleSubmit = () => {
        done()
    };

    const advanceClass = (i) => {
        if (localValue.includes(i)) {
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
                        id={`button-${num}`}
                        className={`m-[0.1rem] rounded-md border w-8 h-8 ${advanceClass(index)}`}
                        onClick={() => handleButtonClick(index)}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <button
                id={`button-done`}
                className={`m-[0.1rem] rounded-md border w-[104px] h-8`}
                onClick={handleSubmit}
            >
                <ArrowUpwardRounded className="ml-[2.5rem] w-5 h-5" />
            </button>
        </div>
    );
}

export default IntInputBox;