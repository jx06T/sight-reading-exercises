import React from "react";
import IntInputBox from "./IntInputBox";
import FloatInputBox from "./FloatInputBox";
import MultipleChoice from "./MultipleChoice";
import SettingArea from "./SettingArea";

function ChordSetting({ callback, ...params }) {
    const onChange = (v) => {
        // console.log(v)
    }

    return (
        <SettingArea title="Chord">
            <div className="setting-area flex flex-row flex-wrap justify-center">
                <div className="jx-3">
                    <span className="">C</span>
                    <MultipleChoice options={['C', 'Cm', 'C6', 'Cm6', 'C7', 'Cm7', 'CM7', 'Csus']} onChange={(newValue) => onChange(newValue,)} className="" />
                </div>
                <div className="jx-3">
                    <span className="">D</span>
                    <MultipleChoice options={['D', 'Dm', 'D6', 'Dm6', 'D7', 'Dm7', 'DM7', 'Dsus']} onChange={(newValue) => onChange(newValue,)} className="" />
                </div>
                <div className="jx-3">
                    <span className="">D♭</span>
                    <MultipleChoice options={['D♭', 'D♭m', 'D♭6', 'D♭m6', 'D♭7', 'D♭m7', 'D♭M7', 'D♭sus']} onChange={(newValue) => onChange(newValue,)} className="" />
                </div>
                <div className="jx-3">
                    <span className="">E</span>
                    <MultipleChoice options={['E', 'Em', 'E6', 'Em6', 'E7', 'Em7', 'EM7', 'Esus']} onChange={(newValue) => onChange(newValue,)} className="" />
                </div>
                <div className="jx-3">
                    <span className="">F</span>
                    <MultipleChoice options={['F', 'Fm', 'F6', 'Fm6', 'F7', 'Fm7', 'FM7', 'Fsus']} onChange={(newValue) => onChange(newValue,)} className="" />
                </div>
                <div className="jx-3">
                    <span className="">G</span>
                    <MultipleChoice options={['G', 'Gm', 'G6', 'Gm6', 'G7', 'Gm7', 'GM7', 'Gsus']} onChange={(newValue) => onChange(newValue,)} className="" />
                </div>
                <div className="jx-3">
                    <span className="">A</span>
                    <MultipleChoice options={['A', 'Am', 'A6', 'Am6', 'A7', 'Am7', 'AM7', 'Asus']} onChange={(newValue) => onChange(newValue,)} className="" />
                </div>
                <div className="jx-3">
                    <span className="">B</span>
                    <MultipleChoice options={['B', 'Bm', 'B6', 'Bm6', 'B7', 'Bm7', 'BM7', 'Csus']} onChange={(newValue) => onChange(newValue,)} className="" />
                </div>
            </div>
        </SettingArea>
    );
}

export default ChordSetting