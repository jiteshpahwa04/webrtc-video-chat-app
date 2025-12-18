import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room : React.FC = () => {
    const { roomId } = useParams();
    const { socket, user, stream, peers } = useContext(SocketContext);

    console.log("User in Room:", user);

    useEffect(() => {
        if (!roomId || !user) return;
        console.log("We have joined the room:", roomId);
        socket.emit("joined-room", { roomId, peerId: user._id });
    }, [roomId, user, socket, peers]);

    return (
        <div>
            Room Page - {roomId}
            Your own user feed:
            <UserFeedPlayer stream={stream} />
            <div>
                Other user's feeds:
                {
                    Object.keys(peers).map((peerId) => (
                        <>
                            <UserFeedPlayer key={peerId} stream={peers[peerId].stream} />
                        </>
                    ))
                }
            </div>

        </div>
    )
}

export default Room;