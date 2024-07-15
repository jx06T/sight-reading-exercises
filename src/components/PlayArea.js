import React, { useState } from "react";
import ABC_Renderer from "./ABC_Renderer";

function PlayArea({ getData, Chart, ...params }) {
    const [rendererData, setRendererData] = useState({})
    const handleClick = (e) => {
        render(getData())
    }
    const render = (data) => {
        let music = "|"
        for (let i = 0; i < data.SheetMusic.lengthSM; i++) {
            for (let j = 0; j < 4; j++) {
                music += "C"
            }
            music += "|"
        }
        setRendererData({
            music: music,
            m: Chart.SheetMusic[0].options[data.SheetMusic.timeSignature].value,
            l: "1/4",
            k: Chart.SightReadin[4].options[data.SightReadin.tonality[Math.floor(Math.random() * data.SightReadin.tonality.length)]].value,
            lengthSM: data.SheetMusic.lengthSM
        })
        console.log(rendererData)
    }

    return (
        <>
            <div className="flex justify-center space-x-6 z-20">
                <button onClick={handleClick} className="jx-2">Render</button>
                <button className="jx-2">Play</button>
                <button className="jx-2">Sound</button>
            </div>
            <ABC_Renderer {...rendererData} />
        </>
    );
}

export default PlayArea