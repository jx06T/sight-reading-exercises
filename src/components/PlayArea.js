import React, { useEffect, useRef, useState } from "react";
import ABC_Renderer from "./ABC_Renderer";

function PlayArea({ getData, ...params }) {
    const [rendererData, setRendererData] = useState({})
    const playBtnRef = useRef(null)

    const probabilityTable = [
        "00",
        "111111111",
        "22222222",
        "33333",
        "4444",
        "555",
        "66",
        "7",
        "8",
        "9",
    ]

    const probabilityTableDT = [
        "000000000",
        "1111111",
        "222222",
        "333",
        "44444",
        "55555",
        "66",
        "777777",
        "88",
        "9",
    ]

    const shiftNote = (note, offset) => {
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

        let octave = 0;
        let pitch = note.charAt(0).toUpperCase();

        for (let i = 1; i < note.length; i++) {
            if (note[i] === ',') octave--;
            else if (note[i] === "'") octave++;
        }

        let index = notes.indexOf(pitch);
        index += offset;
        octave += Math.floor(index / 7);

        index = (index % 7 + 7) % 7;  // 确保索引在 0-6 之间
        let newNote = notes[index];

        if (octave < 0) {
            newNote = newNote + ','.repeat(-octave);
        } else if (octave > 0) {
            newNote = newNote + "'".repeat(octave);
        }
        return newNote;
    }

    const getRandomItem = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)]
    }

    const handleRender = (e) => {
        render(getData())
    }

    const render = (data) => {
        console.log(data)
        let music = "|"
        let lastNote = getRandomItem(data.SightReadin.reference)
        for (let i = 0; i < data.SheetMusic.lengthSM; i++) {
            for (let j = 0; j < 4; j++) {
                const allChoices = probabilityTableDT.reduce((r, e, lI) => {
                    return r + (data.SightReadin.intervalDT.includes(lI) ? e : "")
                }, "")
                const offsetDT = (Math.random() > 0.5 ? 1 : -1) * parseInt(getRandomItem(allChoices))
                // console.log(offsetDT)
                music += offsetDT == 0 ? "" : "["

                if (Math.random() > 0.7 || (data.SightReadin.interval.length == 1 && data.SightReadin.interval[0] == 0)) {
                    const offset = Math.random() > 0.5 ? 0 : 7
                    // console.log(offset)
                    lastNote = shiftNote(getRandomItem(data.SightReadin.reference), offset)
                    music += lastNote
                } else {
                    const allChoices = probabilityTable.reduce((r, e, lI) => {
                        return r + (data.SightReadin.interval.includes(lI) ? e : "")
                    }, "")
                    const offset = (Math.random() > 0.5 ? 1 : -1) * parseInt(getRandomItem(allChoices))
                    // console.log(offset)
                    lastNote = shiftNote(lastNote, offset)
                    music += lastNote
                }

                music += offsetDT == 0 ? "" : shiftNote(lastNote, offsetDT) + "]"
            }
            music += "|"
        }
        setRendererData({
            music: music,
            m: data.SheetMusic.timeSignature,
            l: "1/4",
            k: data.SightReadin.tonality,
            lengthSM: data.SheetMusic.lengthSM,
            bpm: data.SheetMusic.speed
        })

        abcRendererRef.current.renderABC();
        playBtnRef.current.textContent = "Play"
    }

    const abcRendererRef = useRef();



    const handlePlay = (e) => {
        if (abcRendererRef.current.playingRef.current) {
            abcRendererRef.current.pause();
            playBtnRef.current.textContent = "Play"
        } else {
            abcRendererRef.current.play();
            playBtnRef.current.textContent = "Pause"
        }
    };

    const handleMute = (e) => {
        e.target.textContent = abcRendererRef.current.mute() ? "Unmute" : "Mute"
    };

    const handleRollback = () => {
        abcRendererRef.current.renderABC()
    };

    return (
        <>
            <div className="flex justify-center space-x-6">
                <button onClick={handleRender} className="jx-2">Render</button>
                <button onClick={handleRollback} className="jx-2">Rollback</button>
                <button ref={playBtnRef} onClick={handlePlay} className="jx-2">Play</button>
                <button onClick={handleMute} className="jx-2">Mute</button>
            </div>
            <ABC_Renderer ref={abcRendererRef} {...rendererData} />
        </>
    );
}

export default PlayArea