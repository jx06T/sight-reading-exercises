import React from "react";
import IntInputBox from "./IntInputBox";
import MultipleChoice from "./MultipleChoice";

function SightReadingSetting({ callback, ...params }) {
    const onChange = (v) => {
        // console.log(v)
    }

    return (
        <div className="setting-area flex flex-row flex-wrap justify-center">
            <div className="flex m-2 min-w-52">
                <span className="">參考點</span>
                <MultipleChoice options={["C","♯C", "D","♯D", "E", "F","♯F", "G","♯G", "A","♯A", "B"]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">音程</span>
                <MultipleChoice options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">雙音音程</span>
                <MultipleChoice options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">音域</span>
                <MultipleChoice options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} onChange={onChange} className="" />
            </div>
            <div className="flex m-2 min-w-52">
                <span className="">調</span>
                <MultipleChoice options={['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'C♯', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭']} onChange={onChange} className="" />
            </div>
        </div>
    );
}

export default SightReadingSetting