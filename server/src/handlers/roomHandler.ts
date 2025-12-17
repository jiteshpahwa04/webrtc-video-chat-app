import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";

const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidV4(); // This will be our unique room ID in which multiple users will exchange data
        socket.join(roomId);
        socket.emit("room-created", { roomId });
        console.log(`Room created with ID: ${roomId}`);
    }

    const joinRoom = () => {
        console.log(`New room joined`);
    }

    const joinedRoom = ({ roomId }: { roomId: string }) => {
        console.log(`User joined the room: ${roomId}`);
    }

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("joined-room", joinedRoom);
}

export default roomHandler;