import React from "react";
import IntInputBox from "./IntInputBox";

function SettingArea({ callback, ...params }) {
    const onChange = (v) => {
        console.log(v)
    }

    return (
        <div className="setting-area grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex m-2">
                <span className="">度</span>
                <IntInputBox onChange={onChange} className="" />
            </div>
            <div className="flex m-2">
                <span className="">速度</span>
                <IntInputBox onChange={onChange} className="" />
            </div>
            <div className="flex m-2">
                <span className="">速度</span>
                <IntInputBox onChange={onChange} className="" />
            </div>
            <div className="flex m-2">
                <span className="">速度</span>
                <IntInputBox onChange={onChange} className="" />
            </div>
        </div>
    );
}

export default SettingArea