import React, { useEffect, useState } from "react";
import IntInputBox from "./IntInputBox";
import FloatInputBox from "./FloatInputBox";
import MultipleChoice from "./MultipleChoice";
import SingleChoice from "./SingleChoice";
import SettingArea from "./SettingArea";

function SightReadingSetting({ data, callback, ...props  }) {
    const onChange = (v, key) => {
        callback(v, "SightReadin", key)
    }
    return (
        <SettingArea title="Sight Reading">
            <div className="setting-area flex flex-row flex-wrap justify-center">
                {data.map((e, i) => (
                    !e.hide &&
                    <div key={e.key} className="jx-3">
                        <span className="">{e.label}</span>
                        {e.type === "MultipleChoice" ? <MultipleChoice options={e.options.map(e => e.label)} chart={e.options.map(e => e.value)} onChange={(newValue) => onChange(newValue, e.key)} className="" initialValue={e.initialValue} /> :
                            e.type === "SingleChoice" ? <SingleChoice options={e.options.map(e => e.label)} chart={e.options.map(e => e.value)} onChange={(newValue) => onChange(newValue, e.key)} className="" initialValue={e.initialValue} /> :
                            e.type === "FloatInputBox" ? <FloatInputBox min={e.min} max={e.max} onChange={(newValue) => onChange(newValue, e.key)} className="" initialValue={e.initialValue} /> :
                                <IntInputBox min={e.min} max={e.max} onChange={(newValue) => onChange(newValue, e.key)} className="" initialValue={e.initialValue} />
                        }
                    </div>
                ))
                }
            </div>
        </SettingArea>
    );
}

export default SightReadingSetting