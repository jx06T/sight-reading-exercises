import React, { useCallback, useEffect, useRef, useState } from "react";
import PlayArea from "../components/PlayArea";
import SightReadingSetting from "../components/SightReadingSetting"
import ChordSetting from "../components/ChordSetting"
import SheetMusicSetting from "../components/SheetMusicSetting"

function Exercise(params) {
    // const settingParameters = useRef({})
    const [settingParameters, setSettingParameters] = useState({})
    const [settingData, setSettingData] = useState(null);

    const onChange = useCallback((v, key1, key2) => {
        // settingParameters.current[key1] = settingParameters.current[key1] || {}
        // settingParameters.current[key1][key2] = v
        // console.log(settingParameters.current)
        setSettingParameters(prev => ({
            ...prev,
            [key1]: {
                ...(prev[key1] || {}),
                [key2]: v
            }
        }));
        console.log("s")
    })

    useEffect(() => {
        import('../SettingTable.json')
            .then(data => setSettingData(data))
            .catch(error => console.error('Error loading questionnaire:', error));
    }, []);

    const getSettingParameters = () => {
        return settingParameters
    }

    if (!settingData) return <div>Loading...</div>;

    return (
        <div className="m-4 sm:m-8 exercise">
            <SightReadingSetting callback={onChange} data={settingData.SightReadin} />
            {/* <hr />
            <ChordSetting /> */}
            <hr />
            <SheetMusicSetting callback={onChange} data={settingData.SheetMusic} />
            <hr />
            <PlayArea data={settingParameters} getData={getSettingParameters} />
        </div>
    );
}

export default Exercise