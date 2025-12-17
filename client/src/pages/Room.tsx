import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";

const Room : React.FC = () => {
    const { roomId } = useParams();
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        socket.emit("joined-room", { roomId });
    }, []);
    return (
        <div>
            Room Page - {roomId}
        </div>
    )
}

export default Room;