import React, { useState, useRef, useEffect } from "react";
import { BackspaceRounded, ArrowUpwardRounded } from "./Icons"

function IntInputBox({ initialValue = 0, min = -Infinity, max = Infinity, onChange, ...props }) {
    const [value, setValue] = useState(initialValue);
    const [showKeyboard, setShowKeyboard] = useState(false);

    const inputRef = useRef(null);
    const MouseRef = useRef(null);
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
        isDragging.current = true;
        startX.current = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startValue.current = value;
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
        }, 10);
    };

    const handleKeyboardInput = (inputValue, isDone = false) => {
        const newValue = Math.max(min, Math.min(max, parseInt(inputValue) || 0));
        setValue(newValue);
        if (isDone) {
            setShowKeyboard(false);
        }
    };

    return (
        <div {...props }className="flex flex-col items-center w-28 bg-white">
            <div
                ref={MouseRef}
                onDoubleClick={handleDoubleClick}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                className="cursor-ew-resize w-[102px] text-center"
            >
                <input
                    ref={inputRef}
                    type="number"
                    value={value}
                    readOnly
                    className="jx1 w-[102px] text-center border rounded-md outline-none "
                />
            </div>
            {showKeyboard && (
                <CustomKeyboard initialValue={value} onInput={handleKeyboardInput} onClose={() => setShowKeyboard(false)} />
            )}
        </div>
    );
}

function CustomKeyboard({ onInput, onClose, initialValue = 0 }) {
    const [input, setInput] = useState(initialValue);

    const handleButtonClick = (num) => {
        if (num == "s") {
            handleSubmit()
            return
        }
        if (num == "d") {
            handleDelete()
            return
        }
        setInput(prevInput => prevInput + ("" + num))
    };

    useEffect(() => {
        onInput(input);
    }, [input])

    useEffect(() => {
        setInput(initialValue)
    }, [initialValue])

    const handleSubmit = () => {
        onInput(input, "done");
    };

    const handleDelete = () => {
        setInput(prevInput => (prevInput + "").slice(0, -1));
    };

    return (
        <div className="z-10 bg-white bg-opacity-95 absolute  mt-7 custom-keyboard grid grid-cols-3 grid-rows-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "d", 0, 's'].map(num => (
                <button key={num} id={`button-${num}`} className="m-[0.1rem] rounded-md border w-8 h-8" onClick={() => handleButtonClick(num)}>
                    {num === "d" || num == "s" ? (num == "d" ? <BackspaceRounded className="ml-[0.3rem] w-5 h-5" /> : <ArrowUpwardRounded className="ml-[0.3rem] w-5 h-5" />) : num}
                </button>
            ))}
        </div>
    );
}

export default IntInputBox;