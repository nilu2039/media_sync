import React, { useEffect, useRef, useState } from "react"
import ReactPlayer from "react-player"

const Player = ({ socket, room, isCreator }) => {
  const videoRef = useRef(null)
  const [video_duration, setVideo_Duration] = useState("")
  const [isPaused, setIsPaused] = useState(false)
  const [pause, setPause] = useState(false)

  useEffect(async () => {
    await socket.on("video_sec", (data) => {
      setVideo_Duration(data.time)
      setPause(data.isPaused)
      console.log(data)
    })
  }, [socket])

  return (
    <div>
      {isCreator ? (
        <ReactPlayer
          url="media/hello.mp4"
          width="100%"
          height="100%"
          controls={true}
          progressInterval={20}
          ref={videoRef}
          config={{ file: { attributes: { controlsList: "nodownload" } } }}
          onProgress={async (data) => {
            // console.log({ time: data.playedSeconds, room: room, isPaused })
            await socket.emit("video_time", {
              time: data.playedSeconds,
              room: room,
              isPaused,
            })
            setIsPaused(false)
          }}
          onPause={(pause) => {
            console.log(pause)
            setIsPaused(true)
          }}
        />
      ) : (
        video_duration !== "" && (
          <ReactPlayer
            url="media/hello.mp4"
            width="100%"
            height="100%"
            playing={!pause}
            progressInterval={1}
            ref={videoRef}
            config={{ file: { attributes: { controlsList: "nodownload" } } }}
            onProgress={() => {
              videoRef.current.seekTo(video_duration)
            }}
          />
        )
      )}
    </div>
  )
}

export default Player
