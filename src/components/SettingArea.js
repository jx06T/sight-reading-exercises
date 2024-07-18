import React, { useState } from "react";

function SettingArea({ title, children, ...props  }) {
    const [showChildren, setShowChildren] = useState(true)

    return (
        <>
            <h1 onClick={() => setShowChildren(!showChildren)} className="text-center mb-1 cursor-pointer hover:text-slate-700">{title + (showChildren ? " ▼" : " ▶")}</h1>
            {showChildren && children}
        </>
    );
}

export default SettingArea