import Head from "next/head"
import styles from "../styles/Home.module.css"
import io from "socket.io-client"
import { nanoid } from "nanoid"
import Player from "../components/Player"
import { useState } from "react"

const socket = io.connect("http://localhost:3001")

export default function Home() {
  const [showPlayer, setShowPlayer] = useState(false)

  const [room, setRoom] = useState("")
  const [roomID, setRoomID] = useState("")
  const [isCreator, setIsCreator] = useState(false)

  const createRoom = async () => {
    const roomId = nanoid()
    await socket.emit("join_room", roomId)
    setRoom(roomId)
    setShowPlayer(true)
    setIsCreator(true)
  }

  const joinRoom = async (e) => {
    e.preventDefault()
    await socket.emit("join_room", roomID)
    setShowPlayer(true)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Media Sync</title>
        <meta
          name="media sync"
          content="simple but elegant way to sync media across devices."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={createRoom}>Create Room</button>

      <form>
        <input
          type="text"
          placeholder="room ID"
          onChange={(e) => {
            setRoomID(e.target.value)
          }}
        />
        <button onClick={joinRoom}>Join Room</button>
      </form>

      {showPlayer && (
        <Player socket={socket} room={room} isCreator={isCreator} />
      )}
    </div>
  )
}
