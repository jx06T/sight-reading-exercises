import React, { useState, useRef, useEffect, useCallback } from "react";
import { BackspaceRounded, ArrowUpwardRounded, IcRoundPlusMinusAlt } from "./Icons"

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function IntInputBox({ initialValue = 0, min = -Infinity, max = Infinity, onChange, ...props }) {
    const [value, setValue] = useState(initialValue);
    const [showKeyboard, setShowKeyboard] = useState(false);

    const startX = useRef(0);
    const direction = useRef(0);
    const bias = useRef(0);
    const diff = useRef(0);
    const isDragging = useRef(false);
    const startValue = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (onChange) {
            debouncedOnChange(value)
            // onChange(Math.max(min, Math.min(max, value)))
        }
    }, [value]);

    const debouncedOnChange = useCallback(
        debounce((newValue) => {
            if (onChange) {
                onChange(Math.max(min, Math.min(max, newValue)));
            }
        }, 300),
        [onChange, min, max]
    );

    const handleStart = (e) => {
        if (showKeyboard) {
            return
        }
        isDragging.current = true;
        startX.current = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startValue.current = parseFloat(value);
        bias.current = 0
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchend', handleEnd);

        intervalRef.current = setInterval(() => {
            bias.current += direction.current
            const newValue = Math.max(min, Math.min(max, startValue.current + diff.current + bias.current));
            setValue(Math.round(newValue));
        }, 50);
    };

    const handleMove = (e) => {
        if (isDragging.current) {
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            diff.current = Math.round((clientX - startX.current) / 6);
            if (Math.abs(diff.current) > 12) {
                direction.current = (clientX > startX.current) * 2 - 1
                diff.current = 13 * direction.current
            } else {
                direction.current = 0
            }
            const newValue = Math.max(min, Math.min(max, startValue.current + diff.current + bias.current));
            setValue(Math.round(newValue));
        }
    };

    const handleEnd = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handleDoubleClick = () => {
        setValue(startValue.current)
        setTimeout(() => {
            setShowKeyboard(true);
        }, 100);
    };

    const handleKeyboardInput = (newValue) => {
        setValue(newValue)
    }

    return (
        <div {...props} className="flex flex-col items-center w-[144px] px-[4px] bg-white">
            <div
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                className="cursor-ew-resize w-full px-[4px] text-center border rounded-md h-7"
            >
                <p
                    // type="number"
                    // value={value}
                    readOnly
                    className="jx1 w-full  text-center outline-none rounded-md h-6 truncate"
                >
                    {value}
                </p>
            </div>
            {showKeyboard && (
                <CustomKeyboard
                    max={max}
                    min={min}
                    onChange={handleKeyboardInput}
                    initialValue={value}
                    done={() => {
                        setShowKeyboard(false);
                    }}
                />
            )}
        </div>
    );
}

function CustomKeyboard({ onChange, done, initialValue, min, max }) {
    const [localValue, setLocalValue] = useState(initialValue + "");
    const first = useRef(true)

    const handleKeyDown = (e) => {
        if (e.key >= '0' && e.key <= '9') {
            handleType(e.key)
        } else if (e.key === 'Backspace') {
            handleDelete();
        } else if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === '-') {
            handleNegate();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    const handleButtonClick = (num) => {
        if (num === "s") {
            handleSubmit();
        } else if (num === "d") {
            handleDelete();
        } else if (num === "n") {
            handleNegate();
        } else {
            handleType(num)
        }
    };

    useEffect(() => {
        onChange(isNaN(parseFloat(localValue)) ? 0 : parseFloat(localValue));
    }, [localValue]);

    const handleSubmit = () => {
        setLocalValue(prevInput => {
            const newValue = isNaN(parseFloat(localValue)) ? 0 : parseFloat(localValue)
            const newNewValue = Math.max(min, Math.min(max, newValue ? newValue : 0));
            return newNewValue
        });
        setTimeout(() => {
            done()
        }, 10);
    };

    const handleDelete = () => {
        setLocalValue(prevInput => {
            const newValue = prevInput.slice(0, -1)
            return newValue
            // const newNewValue = Math.max(min, Math.min(max, newValue ? newValue : 0));
        });
    };

    const handleNegate = () => {
        // setLocalValue(prevInput => Math.max(min, Math.min(max, parseFloat(prevInput) * -1)));
        setLocalValue(prevInput => (-1 * parseFloat(prevInput)) + "");
    };

    const handleType = (v) => {
        setLocalValue(prevInput => {
            if (first.current) {
                first.current = false
                prevInput = ""
            }
            const newValue = prevInput + "" + v
            return newValue
        });
    };

    const advanceClass = (i) => {
        const b = "border-b-0 rounded-b-none !mb-0 h-[2.1rem]"
        const t = "border-t-0 rounded-t-none !mt-0 h-[2.1rem]"
        const r = "border-r-0 rounded-r-none !mr-0 w-[2.1rem]"
        const l = "border-l-0 rounded-l-none !ml-0 w-[2.1rem]"
        if (i == 3) {
            return b
        }
        if (i == 7) {
            return t
        }
        if (i == 11) {
            return b
        }
        if (i == 15) {
            return t + " " + l
        }
        if (i == 14) {
            return r
        }
        return ""
    }

    return (
        <div className="z-30 bg-white bg-opacity-95 absolute mt-[30px] custom-keyboard grid grid-cols-4 grid-rows-4 rounded-sm">
            {[1, 2, 3, "d", 4, 5, 6, " d", 7, 8, 9, "s", "n", 0, ' s', ' s'].map((num, index) => (
                <button
                    key={num + "" + index}
                    id={`button-${num}`}
                    className={`m-[0.1rem] rounded-md border w-8 h-8 ${advanceClass(index)}`}
                    onClick={() => handleButtonClick((num + "").trim())}
                >
                    {num === "d" ? <BackspaceRounded className="ml-[0.3rem] w-5 h-5" /> :
                        num === "s" ? <ArrowUpwardRounded className="ml-[0.3rem] w-5 h-5" /> :
                            num === "n" ? <IcRoundPlusMinusAlt className="ml-[0.3rem] w-5 h-5" /> : (num + "")[0]}
                </button>
            ))}
        </div>
    );
}

export default IntInputBox;