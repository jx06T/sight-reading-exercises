import React from "react";
import ABC_Renderer from "../components/ABC_Renderer"
import SettingArea from "../components/SettingArea"

function Exercise(params) {
    return (
        <div className="m-4 md:m-10 exercise">
            <SettingArea />
            <ABC_Renderer />
        </div>
    );
}

export default Exercise