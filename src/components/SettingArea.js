import React, { useState } from "react";

function SettingArea({ title, children, ...props }) {
    // const [showChildren, setShowChildren] = useState(true)

    const handleButtonClick = (e) => {
        e.target.textContent = title + (e.target.classList.contains("js-5") ? " ▼" : " ▶")
        if (e.target.classList.contains("js-5")) {
            e.target.classList.remove("js-5")
        } else {
            e.target.classList.add("js-5")
        }
    }

    return (
        <>
            {/* <h1 onClick={() => setShowChildren(!showChildren)} className="text-center mb-1 cursor-pointer hover:text-slate-700">{title + (showChildren ? " ▼" : " ▶")}</h1> */}
            <h1 onClick={handleButtonClick} className="text-center mb-1 cursor-pointer hover:text-slate-700">{title + " ▼"}</h1>
            {/* {showChildren && children} */}
            {children}
        </>
    );
}

export default SettingArea