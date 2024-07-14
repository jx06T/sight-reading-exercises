import React, { useEffect } from "react";
import abcjs from "https://cdn.jsdelivr.net/npm/abcjs@6.4.1/+esm"
function ABC_Renderer({ id = "1", music = "c", m = "4/4", l = "1/4", k = "c", ...params }) {
    const abcNotation = `X:${id}\nM:${m}\nL:${l}\nK:${k}\n${music}`;

    console.log(abcNotation)
    useEffect(() => {
        abcjs.renderAbc("abcjs-container", abcNotation);
    }, [])

    return (
        <div className="abc-renderer flex items-center flex-col overflow-hidden">
            <div id="abcjs-container"></div>
        </div>
    );
}

export default ABC_Renderer