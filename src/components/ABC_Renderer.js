import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import abcjs from "https://cdn.jsdelivr.net/npm/abcjs@6.4.1/+esm"
import "../style/abcjs.css"

const ABC_Renderer = forwardRef(({ PlayingChange, lengthSM, id = "1", music = "c", bpm = 80, m = "4/4", l = "1/4", k = "c", ...params }, ref) => {
    const abcNotation = `X:${id}\nM:${m}\nL:${l}\nK:${k}\nQ:1/4=${bpm}\n${music}`;

    const paperRef = useRef(null);
    const audioRef = useRef(null);
    const synthControlRef = useRef(null);

    const playingRef = useRef(false);
    const controlButtons = useRef({});
    const bpmRef = useRef(bpm);

    const clickHandlerRef = useRef(() => {
        playingRef.current = !playingRef.current;
        PlayingChange();
    });

    const rollbackHandlerRef = useRef(() => {
        paperRef.current.style.transition = ""
        paperRef.current.style.left = "0px";
    });

    const render = () => {
        console.log("---------")
        if (paperRef.current) {
            console.log(bpm)
            paperRef.current.style.transition = ""
            paperRef.current.style.left = "0px";

            const scale = 3;
            const visualObj = abcjs.renderAbc(paperRef.current, abcNotation, {
                scale: scale,
                paddingleft: 0,
                paddingright: 0,
                initialClef: true,
                timeBasedLayout: {
                    minPadding: 15,
                    minWidth: lengthSM * 150 + (lengthSM > 32 ? 0 : (1.5 * (32 - lengthSM) ** 1.1)),
                    align: 'left',
                }
            });

            const renderedSvg = paperRef.current.querySelector("svg");
            if (renderedSvg) {
                paperRef.current.style.width = paperRef.current.offsetWidth + 5 + "px";
            }

            if (controlButtons.current.playBtn) {
                setTune(visualObj[0]);
            } else {
                load(visualObj[0])
            }
        }
    }

    const play = () => {
        if (!playingRef.current) {
            controlButtons.current.playBtn.click();
        }
    };

    const pause = () => {
        if (playingRef.current) {
            controlButtons.current.playBtn.click();
        }
    };

    const rollback = () => {
        controlButtons.current.RollbackBtn.click();
    }

    class CursorControl {
        constructor() {
            this.onEvent = (ev) => {
                paperRef.current.style.transition = `left ${60 / bpmRef.current}s linear`
                // paperRef.current.style.transition = `left ${60 / bpm * 0.5}s linear`
                paperRef.current.style.left = `-${ev.left * 3 - 300}px`;

                if (ev.measureStart && ev.left === null) return;

                var lastSelection = document.querySelectorAll("svg .highlight");
                for (var k = 0; k < lastSelection.length; k++) {
                    lastSelection[k].classList.remove("highlight");
                }

                for (var i = 0; i < ev.elements.length; i++) {
                    var note = ev.elements[i];
                    for (var j = 0; j < note.length; j++) {
                        note[j].classList.add("highlight");
                    }
                }
            };
        }
    }

    const cursorControl = new CursorControl();
    const load = (visualObj) => {
        if (abcjs.synth.supportsAudio()) {
            synthControlRef.current = new abcjs.synth.SynthController();
            synthControlRef.current.load("#audio", cursorControl, { displayRestart: true, displayPlay: true, displayLoop: true });
            setTune(visualObj);
        } else {
            document.querySelector("#audio").innerHTML = "<div class='audio-error'>瀏覽器不支援音頻播放。</div>";
        }
    }
    const setTune = (visualObj) => {
        synthControlRef.current.disable(true);

        let midiBuffer = new abcjs.synth.CreateSynth();
        midiBuffer.init({ visualObj: visualObj }).then(() => {
            const playBtn = audioRef.current.querySelector(".abcjs-midi-start")
            playBtn.removeEventListener("click", clickHandlerRef.current);
            playBtn.addEventListener("click", clickHandlerRef.current);

            const RollbackBtn = audioRef.current.querySelector(".abcjs-midi-reset")
            RollbackBtn.removeEventListener("click", rollbackHandlerRef.current);
            RollbackBtn.addEventListener("click", rollbackHandlerRef.current);
            controlButtons.current = { playBtn, RollbackBtn }

            synthControlRef.current.setTune(visualObj, true).then((response) => {
            });

        }).catch((error) => {
            console.warn("音頻加載問題:", error);
        });
    }

    useImperativeHandle(ref, () => ({
        paperRef,
        render,
        play,
        pause,
        rollback,
        playingRef,
    }));

    useEffect(() => {
        bpmRef.current = bpm;
        render();
    }, [abcNotation, lengthSM, bpm]);

    return (
        <>
            <div ref={audioRef} id="audio" className="jx-4 mt-4 mb-8"></div>
            <div className="relative w-full !h-[700px] -mt-7 abc-renderer overflow-hidden">
                <div ref={paperRef} className="abc-child absolute !h-[700px]">
                    <div id="abcjs-container"></div>
                </div>
            </div>
        </>
    );
});

export default ABC_Renderer;