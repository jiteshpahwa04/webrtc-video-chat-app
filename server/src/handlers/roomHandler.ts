import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const rooms: Record<string, string[]> = {};
const roomHandler = (socket: Socket) => {


    const createRoom = () => {
        const roomId = uuidV4(); // This will be our unique room ID in which multiple users will exchange data
        socket.join(roomId);
        socket.emit("room-created", { roomId });
        console.log(`Room created with ID: ${roomId}`);
        rooms[roomId] = [];
    }

    const joinRoom = () => {
        console.log(`New room joined`);
    }

    const joinedRoom = ({ roomId, peerId }: { roomId: string, peerId: string }) => {
        console.log(`User joined the room: ${roomId} with peer ID: ${peerId}`);
        if (rooms[roomId]) {
            rooms[roomId].push(peerId);
            socket.join(roomId);
            socket.emit("get-users", {
                roomId,
                participants: rooms[roomId]
            })
        } else {
            socket.emit("error", { message: "Room does not exist." });
        }
    }

    const leavedRoom = () => {
        console.log(`User disconnected from room`);
        rooms && Object.keys(rooms).forEach(roomId => {
            rooms[roomId] = rooms[roomId].filter(peerId => peerId !== socket.id);
        }); 
    }

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("joined-room", joinedRoom);
    socket.on("disconnect", leavedRoom);
}

export default roomHandler;