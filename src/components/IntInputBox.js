import React, { useState, useRef, useEffect } from "react";
import { BackspaceRounded, ArrowUpwardRounded, IcRoundPlusMinusAlt } from "./Icons"

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
            onChange(value);
        }
    }, [value, onChange]);

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
            diff.current = Math.round((clientX - startX.current) / 4);
            if (Math.abs(diff.current) > 14) {
                direction.current = (clientX > startX.current) * 2 - 1
                diff.current = 15 * direction.current
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
        <div {...props} className="flex flex-col items-center w-28 px-[4px] bg-white">
            <div
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                className="cursor-ew-resize w-full px-[4px] text-center border rounded-md h-7"
            >
                <span
                    // type="number"
                    // value={value}
                    readOnly
                    className="jx1 w-full  text-center outline-none rounded-md h-6"
                >
                    {value}
                </span>
            </div>
            {showKeyboard && (
                <CustomKeyboard
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

function CustomKeyboard({ onChange, done, initialValue }) {
    const [localValue, setLocalValue] = useState(initialValue);
    const first = useRef(true)

    const handleKeyDown = (e) => {
        if (e.key >= '0' && e.key <= '9') {
            setLocalValue(prevInput => {
                if (first.current) {
                    first.current = false
                    prevInput = ""
                }
                const newValue = prevInput + "" + e.key
                return parseFloat(newValue)
            });
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
        if (num === "s" || num === "") {
            handleSubmit();
            return;
        }
        if (num === "d") {
            handleDelete();
            return;
        }
        if (num === "n") {
            handleNegate();
            return;
        }
        setLocalValue(prevInput => {
            if (first.current) {
                first.current = false
                prevInput = ""
            }
            const newValue = prevInput + "" + num
            return parseFloat(newValue)

        });
    };

    useEffect(() => {
        onChange(isNaN(localValue) ? 0 : localValue);
    }, [localValue, onChange]);

    const handleSubmit = () => {
        done()
    };

    const handleDelete = () => {
        setLocalValue(prevInput => {
            const newValue = parseFloat((prevInput + "").slice(0, -1))
            return newValue ? parseFloat((prevInput + "").slice(0, -1)) : 0
        });
    };

    const handleNegate = () => {
        setLocalValue(prevInput => parseFloat(prevInput) * -1);
    };

    const advanceClass = (i) => {
        if (i == 11) {
            return "border-b-0 rounded-b-none !mb-0 h-[2.1rem]"
        }
        if (i == 13) {
            return "border-r-0 rounded-r-none !mr-0 w-[2.1rem]"
        }
        if (i == 14) {
            return "border-l-0 rounded-l-none border-t-0 rounded-t-none !ml-0 !mt-0 w-[2.1rem] h-[2.1rem]"
        }
        return ""
    }

    return (
        <div className="z-10 bg-white bg-opacity-95 absolute mt-[30px] custom-keyboard grid grid-cols-3 grid-rows-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "n", 0, "s", 'd', '', ''].map((num, index) => (
                <button
                    key={num + "" + index}
                    id={`button-${num}`}
                    className={`m-[0.1rem] rounded-md border w-8 h-8 ${advanceClass(index)}`}
                    onClick={() => handleButtonClick(num)}
                >
                    {num === "d" ? <BackspaceRounded className="ml-[0.3rem] w-5 h-5" /> :
                        num === "s" ? <ArrowUpwardRounded className="ml-[0.3rem] w-5 h-5" /> :
                            num === "n" ? <IcRoundPlusMinusAlt className="ml-[0.3rem] w-5 h-5" /> : num}
                </button>
            ))}
        </div>
    );
}

export default IntInputBox;