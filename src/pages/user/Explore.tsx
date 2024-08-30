import { useEffect } from "react";
import ListCard from "../../components/user/Explore/ListCard";
import SideBar from "../../components/user/Explore/sideBar"; 
import useShowToast from "../../Custom Hook/showToaster";
import Store from "../../store/store";
import { socket } from "../../socket/socket";

const Explore: React.FC = () => {
    const toast = useShowToast();
  const myId = Store((c) => c.user._id);

  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }

    console.log("Socket is connected:", socket.connected); // Debugging socket connection

    socket.on("notification", (notification) => {
      console.log("Notification received:", notification); // Check the notification data

      const { sender, receiver, text, time } = notification;

      if (myId === receiver) {
        console.log("Notification matches user ID. Displaying toast:", text);
        toast(text, "success", true);
      }
    });

    return () => {
      console.log("Cleaning up socket event listener");
      socket.off("notification");
    };
  }, [myId, toast]);
    return (
        <div className="flex">
            <SideBar />
            <main className="md:ml-80 p-6">
                <ListCard />
            </main>
        </div>
    );
};

export default Explore;