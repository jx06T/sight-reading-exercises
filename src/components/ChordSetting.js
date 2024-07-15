import React from "react";
import IntInputBox from "./IntInputBox";
import FloatInputBox from "./FloatInputBox";
import MultipleChoice from "./MultipleChoice";

function ChordSetting({ callback, ...params }) {
    const onChange = (v) => {
        // console.log(v)
    }

    return (
        <div className="setting-area flex flex-row flex-wrap justify-center">
            <div className="flex m-2 min-w-52">
                <span className="">C</span>
                <MultipleChoice options={["C", "D", "E", "F", "G", "A", "B"]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">D</span>
                <MultipleChoice options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">E</span>
                <MultipleChoice options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">F</span>
                <MultipleChoice options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">G</span>
                <MultipleChoice options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">A</span>
                <MultipleChoice options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">B</span>
                <MultipleChoice options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={onChange} className="" />
            </div>
        </div>
    );
}

export default ChordSetting