import React, { useEffect, useRef, useState } from "react";
import abcjs from "https://cdn.jsdelivr.net/npm/abcjs@6.4.1/+esm"
function ABC_Renderer({ lengthSM, id = "1", music = "c", m = "4/4", l = "1/4", k = "c", ...params }) {
    const abcNotation = `X:${id}\nM:${m}\nL:${l}\nK:${k}\n${music}`;
    const containerRef = useRef(null);
    const containerLeftRef = useRef(0);

    useEffect(() => {
        if (containerRef.current) {
            containerLeftRef.current = 0
            const targetWidth = lengthSM * 300; // 目標寬度
            const scale = 3; // 可以調整這個值來改變整體大小
            const multiple = lengthSM < 9 ? ((30 - lengthSM) * 0.4) : 5
            console.log(multiple)
            abcjs.renderAbc(containerRef.current, abcNotation, {
                scale: scale,
                staffwidth: targetWidth / scale * multiple,
                paddingleft: 0,
                paddingright: 0,
            });

            const renderedSvg = containerRef.current.querySelector("svg");
            if (renderedSvg) {
                // console.log(renderedSvg.width)
                containerRef.current.style.width = renderedSvg.width.baseVal.value + "px"
                containerRef.current.style.height = renderedSvg.height.baseVal.value + "px"
            }
        }
    }, [abcNotation, lengthSM]);

    useEffect(() => {
        setInterval(() => {
            containerLeftRef.current -= 2
            containerRef.current.style.left = containerLeftRef.current + "px"
        }, 50);
    }, [])

    return (
        <div className="relative  w-full h-96 -mt-7 abc-renderer overflow-hidden">
            <div ref={containerRef} className="absolute">
                <div id="abcjs-container"></div>
            </div>
        </div>
    );
}

export default ABC_Renderer