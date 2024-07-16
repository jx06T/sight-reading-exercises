import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import abcjs from "https://cdn.jsdelivr.net/npm/abcjs@6.4.1/+esm"

const ABC_Renderer = forwardRef(({ lengthSM, id = "1", music = "c", bpm = 80, m = "4/4", l = "1/4", k = "c", ...params }, ref) => {
    const abcNotation = `X:${id}\nM:${m}\nL:${l}\nK:${k}\nQ:1/4=${bpm}\n${music}`;
    const containerRef = useRef(null);
    const audioRef = useRef(null);
    const containerLeftRef = useRef(0);
    const animationRef = useRef(null);
    const playingRef = useRef(false);
    let isMuteRef = useRef(false);
    let isFirst = true;
    let lastTime = 0;

    const [midiBuffer, setMidiBuffer] = useState(null)

    const renderABC = () => {
        if (containerRef.current) {
            // console.log(abcNotation)
            containerLeftRef.current = 0;
            containerRef.current.style.left = containerLeftRef.current + "px";
            const scale = 3;

            // const visualObj = abcjs.renderAbc(containerRef.current, abcNotation, {
            const visualObj = abcjs.renderAbc("abcjs-container", abcNotation, {
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
                containerRef.current.style.width = lengthSM * 444 + 210 + "px";
                // containerRef.current.style.height = renderedSvg.height.baseVal.value + "px";
            }

            if (!midiBuffer) {
                playAudio(visualObj[0])
            }
            pause()
            if (midiBuffer) {
                midiBuffer.stop();
                isFirst = true;
            }
            load(visualObj[0])
        }
    }

    const playAudio = (visualObj) => {
        if (abcjs.synth.supportsAudio()) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            let midiBuffer = new abcjs.synth.CreateSynth();
            midiBuffer.init({
                //audioContext: new AudioContext(),
                audioContext: audioContext,
                visualObj: visualObj,
                // sequence: [],
                // millisecondsPerMeasure: 1000,
                // debugCallback: function(message) { console.log(message) },
                options: {
                    // soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/" ,
                    // sequenceCallback: function(noteMapTracks, callbackContext) { return noteMapTracks; },
                    // callbackContext: this,
                    // onEnded: function(callbackContext),
                    // pan: [ -0.5, 0.5 ]
                }
            }).then((response) => {
                // alert(midiBuffer.prime())
                // console.log(response);
                midiBuffer.prime().then((response) => {
                    setMidiBuffer(midiBuffer)
                    // alert('dcvv d')
                    // midiBuffer.start();
                    // midiBuffer.pause();
                });
            }).catch((error) => {
                console.warn("Audio problem:", error);
                alert("dsdsdsdsdmidiBuffer")
            });
        } else {
            document.querySelector(".error").innerHTML = "<div class='audio-error'>Audio is not supported in this browser.</div>";
        }
    }

    const play = () => {
        console.log(isMuteRef.current)
        if (animationRef.current) return;
        playingRef.current = true;

        if (midiBuffer && !isMuteRef.current) {
            console.log(isFirst)
            if (!isFirst) {
                midiBuffer.start();
            } else {
                setTimeout(() => {
                    midiBuffer.start();
                    isFirst = false;
                }, 36000 / bpm);
            }
        }

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
                pause()
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

    const pause = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
            playingRef.current = false;

            if (midiBuffer) {
                console.log(midiBuffer)
                midiBuffer.pause();
            }
        }
    };

    const mute = () => {
        if (playingRef.current) {
            renderABC()
            isMuteRef.current = !isMuteRef.current
            play()
        } else {
            renderABC()
            isMuteRef.current = !isMuteRef.current
        }
        return isMuteRef.current
    }

    useImperativeHandle(ref, () => ({
        containerRef,
        renderABC,
        play,
        pause,
        mute,
        playingRef,
    }));

    useEffect(() => {
        renderABC();
        return () => {
        }
    }, [abcNotation, lengthSM]);

    function load(visualObj) {
        if (abcjs.synth.supportsAudio()) {
            synthControl = new abcjs.synth.SynthController();
            synthControl.load("#audio", null, { displayPlay: true });
            setTune(visualObj);
        } else {
            document.querySelector("#audio").innerHTML = "<div class='audio-error'>瀏覽器不支援音頻播放。</div>";
        }
    }
    let synthControl;

    function setTune(visualObj) {
        synthControl.disable(true);
        var midiBuffer = new abcjs.synth.CreateSynth();
        midiBuffer.init({ visualObj: visualObj }).then(function () {
            synthControl.setTune(visualObj, true);
        }).catch(function (error) {
            console.warn("音頻加載問題:", error);
        });
        console.log(synthControl, "---------------------")

    }
    console.log(synthControl, "---------------------")
    return (
        <>
            <div ref={audioRef} id="audio" className="jx-4 mt-4 mb-8"></div>
            <div className="relative w-full !h-[500px] -mt-7 abc-renderer overflow-hidden">
                <div ref={containerRef} className="absolute !h-[500px]">
                    <div id="abcjs-container"></div>
                </div>
                <div className="absolute border-l-2 border-blue-700 border-dashed border-opacity-50 w-[4px] h-[160px]  left-[167px] top-[130px]">
                </div>
            </div>
        </>
    );
});

export default ABC_Renderer;