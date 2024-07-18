import React, { useCallback, useEffect, useRef, useState } from "react";
import PlayArea from "../components/PlayArea";
import SightReadingSetting from "../components/SightReadingSetting"
import ChordSetting from "../components/ChordSetting"
import SheetMusicSetting from "../components/SheetMusicSetting"

function Exercise(params) {
    const [settingParameters, setSettingParameters] = useState({})
    const [settingData, setSettingData] = useState(null);

    const onChange = useCallback((v, key1, key2) => {
        setSettingParameters(prev => ({
            ...prev,
            [key1]: {
                ...(prev[key1] || {}),
                [key2]: v
            }
        }));
    })

    useEffect(() => {
        import('../SettingTable.json')
            .then(data => setSettingData(data))
            .catch(error => console.error('Error loading questionnaire:', error));
    }, []);

    if (!settingData) return <div>Loading...</div>;

    return (
        <div className="m-3 mt-4 sm:mt-8 exercise">
            <SightReadingSetting callback={onChange} data={settingData.SightReadin} />
            {/* <hr />
            <ChordSetting /> */}
            <hr />
            <SheetMusicSetting callback={onChange} data={settingData.SheetMusic} />
            <hr />
            <PlayArea data={settingParameters} />
        </div>
    );
}

export default Exercise