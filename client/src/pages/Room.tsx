import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room : React.FC = () => {
    const { roomId } = useParams();
    const { socket, user, stream } = useContext(SocketContext);

    console.log("User in Room:", user);

    useEffect(() => {
        if (roomId && user) {
            socket.emit("joined-room", { roomId, peerId: user._id });
        }
    }, [roomId, user, socket]);

    return (
        <div>
            Room Page - {roomId}
            <UserFeedPlayer stream={stream} />
        </div>
    )
}

export default Room;