import React from "react";
import IntInputBox from "./IntInputBox";
import MultipleChoice from "./MultipleChoice";

function SettingArea({ callback, ...params }) {
    const onChange = (v) => {
        // console.log(v)
    }

    return (
        <div className="setting-area grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="flex m-2">
                <span className="">參考點</span>
                <MultipleChoice options={["C","D","E","F","G","A","B"]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2">
                <span className="">前後音程</span>
                <MultipleChoice options={[0,1,2,3,4,5,6,7,8,9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2">
                <span className="">雙音音程</span>
                <MultipleChoice options={[0,1,2,3,4,5,6,7,8,9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2">
                <span className="">速度</span>
                <IntInputBox onChange={onChange} className="" initialValue={80} />
            </div>
        </div>
    );
}

export default SettingArea