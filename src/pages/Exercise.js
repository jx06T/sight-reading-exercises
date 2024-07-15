import React from "react";
import ABC_Renderer from "../components/ABC_Renderer"
import SightReadingSetting from "../components/SightReadingSetting"
import ChordSetting from "../components/ChordSetting"
import SheetMusicSetting from "../components/SheetMusicSetting"

function Exercise(params) {
    return (
        <div className="m-4 sm:m-10 exercise">
            <SightReadingSetting />
            <hr />
            <ChordSetting />
            <hr />
            <SheetMusicSetting />
            <hr />
            <ABC_Renderer />
        </div>
    );
}

export default Exercise