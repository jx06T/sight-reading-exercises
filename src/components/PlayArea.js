import React, { useEffect, useRef, useState } from "react";
import ABC_Renderer from "./ABC_Renderer";
import { IonDiceOutline, PhPauseFill, Right12Filled, RestartAltRounded } from "./Icons"

function PlayArea({ data, ...props  }) {
    const [rendererData, setRendererData] = useState({})
    const [isPlaying, setIsPlaying] = useState(false)
    const abcRendererRef = useRef();

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
        e.stopPropagation();
        render(data)
    }

    const generate = (first, data) => {
        const M = data.SheetMusic.timeSignature.split("/").map(e => parseInt(e))

        let musicR = "|"
        let musicL = "|"
        let lastNote = first
        for (let i = 0; i < data.SheetMusic.lengthSM; i++) {
            for (let j = 0; j < M[0]; j++) {
                const allChoices = probabilityTableDT.reduce((r, e, lI) => {
                    return r + (data.SightReadin.intervalDT.includes(lI) ? e : "")
                }, "")
                const offsetDT = (Math.random() > 0.5 ? 1 : -1) * parseInt(getRandomItem(allChoices))
                musicR += offsetDT == 0 ? "" : "["
                musicL += offsetDT == 0 ? "" : "["

                if (Math.random() > 0.7 || (data.SightReadin.interval.length == 1 && data.SightReadin.interval[0] == 0)) {
                    const offset = Math.random() > 0.5 ? 0 : 7
                    // console.log(offset)
                    lastNote = shiftNote(getRandomItem(data.SightReadin.reference), offset)
                    musicR += lastNote
                } else {
                    const allChoices = probabilityTable.reduce((r, e, lI) => {
                        return r + (data.SightReadin.interval.includes(lI) ? e : "")
                    }, "")
                    const offset = (Math.random() > 0.5 ? 1 : -1) * parseInt(getRandomItem(allChoices))
                    // console.log(offset)
                    lastNote = shiftNote(lastNote, offset)
                    musicR += lastNote
                }
                musicL += shiftNote(lastNote, -7)

                musicR += offsetDT == 0 ? "" : shiftNote(lastNote, offsetDT) + "]"
                musicL += offsetDT == 0 ? "" : shiftNote(lastNote, offsetDT - 7) + "]"
            }
            musicR += "|"
            musicL += "|"
        }
        return { musicL, musicR }
    }

    const render = (data) => {
        const M = data.SheetMusic.timeSignature.split("/").map(e => parseInt(e))
        const isSame = data.SheetMusic.leftHand == "Sa"
        let musicR = "|"
        let musicL = "|"
        if (data.SheetMusic.rightHand == "ST" && isSame) {
            const music = generate(getRandomItem(data.SightReadin.reference), data)
            musicR = music.musicR
            musicL = music.musicL
        } else {
            if (data.SheetMusic.leftHand == "ST") {
                musicL = generate(getRandomItem(data.SightReadin.reference), data).musicL
            }
            if (data.SheetMusic.rightHand == "ST") {
                musicR = generate(getRandomItem(data.SightReadin.reference), data).musicR
            }
        }


        const AllMusic = `%%staves {(RH) (LH)}\nV:RH clef=treble\nV:LH clef=bass\nV: RH\n${musicR}\nV: LH\n${musicL}`
        console.log(AllMusic)
        setRendererData({
            music: AllMusic,
            m: data.SheetMusic.timeSignature,
            l: "1/" + M[1],
            k: data.SightReadin.tonality,
            lengthSM: data.SheetMusic.lengthSM,
            bpm: data.SheetMusic.speed,
            scale:data.SheetMusic.scale/10
        })
        abcRendererRef.current.render();
        setIsPlaying(false)
    }

    const handlePlay = (e) => {
        e.stopPropagation();
        if (abcRendererRef.current.playingRef.current) {
            abcRendererRef.current.pause();
        } else {
            abcRendererRef.current.play();
        }
    };

    const handleRollback = (e) => {
        e.stopPropagation();
        abcRendererRef.current.rollback()
    };

    const handlePlayingChange = () => {
        setIsPlaying(abcRendererRef.current.playingRef.current)
    };

    useEffect(() => {
        if (data.SightReadin) {
            render(data)
        }
    }, [data])

    return (
        <>
            <ABC_Renderer ref={abcRendererRef} {...rendererData} PlayingChange={handlePlayingChange} >
                <div onClick={handlePlay} className={`${isPlaying ? "opacity-0" : "opacity-100"} z-20 flex justify-center items-center space-x-12 bg-slate-100 h-[100%] w-full rounded-md`}>
                    {!isPlaying &&
                        <>
                            <button onClick={handleRender} className="jx-2">{<IonDiceOutline />}</button>
                            <button onClick={handlePlay} className="jx-2">{isPlaying ? <PhPauseFill /> : <Right12Filled />}</button>
                            <button onClick={handleRollback} className="jx-2">{<RestartAltRounded />}</button>
                        </>
                    }
                </div>
            </ABC_Renderer>
        </>
    );
}

export default PlayArea