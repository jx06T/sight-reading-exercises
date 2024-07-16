import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import abcjs from "https://cdn.jsdelivr.net/npm/abcjs@6.4.1/+esm"

const ABC_Renderer = forwardRef(({ lengthSM, id = "1", music = "c", bpm = 80, m = "4/4", l = "1/4", k = "c", ...params }, ref) => {
    const abcNotation = `X:${id}\nM:${m}\nL:${l}\nK:${k}\nQ:1/4=${bpm}\n${music}`;
    const containerRef = useRef(null);
    const audioRef = useRef(null);
    const containerLeftRef = useRef(0);
    const animationRef = useRef(null);
    const playingRef = useRef(false);

    const isMuteRef = useRef(false);
    let lastTime = 0;

    const [midiBuffer, setMidiBuffer] = useState(null)

    const renderABC = () => {
        if (containerRef.current) {
            // console.log(abcNotation)
            containerLeftRef.current = 0;
            containerRef.current.style.left = containerLeftRef.current + "px";
            const scale = 3;

            const visualObj = abcjs.renderAbc(containerRef.current, abcNotation, {
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

            const renderedSvg = containerRef.current.querySelector("svg");
            if (renderedSvg) {
                // containerRef.current.style.width = lengthSM * 444 + 210 + "px";
                containerRef.current.style.width = containerRef.current.offsetWidth + 5 + "px";
                // containerRef.current.style.height = renderedSvg.height.baseVal.value + "px";
            }

            if (midiBuffer) {
                pause()
                console.log('s')
            }
            load(visualObj[0])
        }
    }

    const play = () => {
        if (animationRef.current) return;

        if (midiBuffer && !isMuteRef.current && !playingRef.current) {
            midiBuffer.click();
        }

        playingRef.current = true;
        const pixelsPerBeat = 110;
        const beatsPerSecond = bpm / 60;
        const pixelsPerSecond = pixelsPerBeat * beatsPerSecond;
        const pixelsPerMillisecond = pixelsPerSecond / 1000;

        const animate = (t) => {
            if (t - lastTime > 100) {
                lastTime = t - 7
            }
            containerLeftRef.current -= pixelsPerMillisecond * (t - lastTime);
            lastTime = t
            if (parseInt(containerLeftRef.current) < -1 * parseInt(containerRef.current.style.width)) {
                containerLeftRef.current = "0"
                containerRef.current.style.left = `${containerLeftRef.current}px`;
                pause(true)
            }
            if (containerRef.current) {
                containerRef.current.style.left = `${containerLeftRef.current}px`;
            }
            if (playingRef.current) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };
        animationRef.current = requestAnimationFrame(animate);
    };

    const pause = (t = false) => {
        if (animationRef.current) {
            console.log(playingRef.current)
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;

            if (midiBuffer && !t && !isMuteRef.current && playingRef.current) {
                midiBuffer.click();
            }
            playingRef.current = false;
        }
    };

    class CursorControl {
        constructor() {
            var self = this;
            self.onEvent = function (ev) {
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
            synthControl = new abcjs.synth.SynthController();
            synthControl.load("#audio", cursorControl, { displayPlay: true });
            setTune(visualObj);
        } else {
            document.querySelector("#audio").innerHTML = "<div class='audio-error'>瀏覽器不支援音頻播放。</div>";
        }
    }

    let synthControl;
    const setTune = (visualObj) => {
        synthControl.disable(true);
        let midiBuffer0 = new abcjs.synth.CreateSynth();
        midiBuffer0.init({ visualObj: visualObj }).then(() => {
            const midiBuffer1 = audioRef.current.querySelector(".abcjs-midi-start")
            setMidiBuffer(midiBuffer1)
            synthControl.setTune(visualObj, true).then((response) => {
                console.log("Audio successfully loaded.")
            });
        }).catch(function (error) {
            console.warn("音頻加載問題:", error);
        });
    }

    useImperativeHandle(ref, () => ({
        containerRef,
        renderABC,
        play,
        pause,
        playingRef,
    }));

    useEffect(() => {
        renderABC();
    }, [abcNotation, lengthSM]);

    return (
        <>
            <div ref={audioRef} id="audio" className="jx-4 mt-4 mb-8"></div>
            <div className="relative w-full !h-[700px] -mt-7 abc-renderer overflow-hidden">
                <div ref={containerRef} className="absolute !h-[700px]">
                    <div id="abcjs-container"></div>
                </div>
                {/* <div className="absolute border-l-2 border-blue-700 border-dashed border-opacity-50 w-[4px] h-[160px]  left-[167px] top-[130px]"> */}
                {/* </div> */}
            </div>
        </>
    );
});

export default ABC_Renderer;