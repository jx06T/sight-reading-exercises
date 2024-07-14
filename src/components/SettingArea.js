import React from "react";
import IntInputBox from "./IntInputBox";

function SettingArea({ callback, ...params }) {
    const onChange = (a) => {
        console.log(a)
    }

    return (
        <div className="setting-area">
            <IntInputBox />
        </div>
    );
}

export default SettingArea