import React from "react";
import IntInputBox from "./IntInputBox";
import MultipleChoice from "./MultipleChoice";
import SingleChoice from "./SingleChoice";

function SheetMusicSetting({ callback, ...params }) {
    const onChange = (v) => {
        // console.log(v)
    }

    return (
        <div className="setting-area flex flex-row flex-wrap justify-center">
            <div className="flex m-2 min-w-52">
                <span className="">拍號</span>
                <SingleChoice options={["2/4", "3/4", "4/4", "2/2", "3/8", "6/8", "9/8", "12/8", "5/4", "7/4", "5/8", "7/8", "11/8"
                ]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">速度</span>
                <IntInputBox onChange={onChange} className="" initialValue={80} min={1} max={200}/>
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">行數</span>
                <IntInputBox onChange={onChange} className="" initialValue={80} />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">右手</span>
                <SingleChoice options={["2/4", "3/4", "4/4", "2/2", "3/8", "6/8", "9/8", "12/8", "5/4", "7/4", "5/8", "7/8", "11/8"
                ]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">左手</span>
                <SingleChoice options={["2/4", "3/4", "4/4", "2/2", "3/8", "6/8", "9/8", "12/8", "5/4", "7/4", "5/8", "7/8", "11/8"
                ]} onChange={onChange} className="" />
            </div>
        </div>
    );
}

export default SheetMusicSetting