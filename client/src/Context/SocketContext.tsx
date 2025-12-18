import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";
import { peerReducer } from "../Reducers/peerReducer";
import { addPeerAction } from "../Actions/peerAction";

const ws_server = "http://localhost:5500";

export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(ws_server, {
    transports: ["websocket", "polling"],
    withCredentials: false,
});

interface Props {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState<Peer>(); // new peer user
    const [stream, setStream] = useState<MediaStream>();

    const [peers, dispatch] = useReducer(peerReducer, {}); // peer -> state

    const fetchParticipantsList = ({roomId, participants}: {roomId: string, participants: string[]}) => {
        console.log(`Room ID: ${roomId}, Participants: `, participants);
    }

    const fetchUserStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); // request for video and audio permissions, browser will prompt the user. It is a browser API!
        setStream(stream);
    }

    useEffect(() => {

        const userId = uuidv4();
        const newPeer = new Peer(userId, {
            host: 'localhost',
            port: 9000,
            path: '/myapp'
        });
        setUser(newPeer);

        fetchUserStream();

        const enterRoom = ({roomId}: {roomId: string}) => {
            navigate(`/room/${roomId}`);
        }

        socket.on("room-created", enterRoom);

        socket.on("get-users", fetchParticipantsList);
    }, []);

    useEffect(() => {
        if (!user || !stream) return;

        socket.on("user-joined", ({ peerId }: { peerId: string }) => {
            const call = user.call(peerId, stream);
            console.log("Calling new user:", peerId);
            call.on("stream", () => {
                dispatch(addPeerAction(peerId, stream));
            })
        });

        socket.on("call", (call) => {
            console.log("Receiving a call");
            call.answer(stream);
            call.on("stream", () => {
                dispatch(addPeerAction(call.peer, stream));
            })
        })
    }, [user, stream]);

    return (
        <SocketContext.Provider value={{ socket, user, stream, peers }}>
            {children}
        </SocketContext.Provider>
    )
}