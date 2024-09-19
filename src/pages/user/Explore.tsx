import { useEffect, useState } from "react";
import ListCard from "../../components/user/Explore/ListCard";
import SideBar from "../../components/user/Explore/sideBar"; 
import useShowToast from "../../Custom Hook/showToaster";
import Store from "../../store/store";
import { socket } from "../../socket/socket";

const Explore: React.FC = () => {
    const toast = useShowToast();
    const [loading,setLoading]=useState<boolean>(false)
    const myId = Store((c) => c.user._id);
    
    const [filters, setFilters] = useState({
        searchTerm: '',
        sortBy: 'name',
        sortOrder: 'asc',
        category: undefined,
        subcategory: undefined,
    });

    useEffect(() => {
        if (!socket) {
            console.error("Socket is not initialized.");
            return;
        }

        console.log("Socket is connected:", socket.connected); 

        socket.on("notification", (notification) => {
            console.log("Notification received:", notification); 

            const {  receiver, text } = notification;

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

    const updateFilters = (newFilters:any) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters
        }));
    };

    return (
        <div className="flex">
            <SideBar updateFilters={updateFilters} setLoading={setLoading} />
            <main className="flex-1">
                <ListCard filters={filters} loading={loading} /> 
            </main>
        </div>
    );
};

export default Explore;
