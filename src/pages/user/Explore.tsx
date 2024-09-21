import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ListCard from "../../components/user/Explore/ListCard";
import SideBar from "../../components/user/Explore/sideBar"; 
import useShowToast from "../../Custom Hook/showToaster";
import Store from "../../store/store";
import { socket } from "../../socket/socket";

const Explore: React.FC = () => {
    const toast = useShowToast();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const categoryId = query.get('categoryId');
    
    const [loading, setLoading] = useState<boolean>(false);
    const myId = Store((c) => c.user._id);
    
    const [filters, setFilters] = useState({
        searchTerm: '',
        sortBy: 'name',
        sortOrder: 'asc',
        category: categoryId, // Use the category ID from the URL
        subcategory: undefined,
    });

    useEffect(() => {
        if (!socket) {
            console.error("Socket is not initialized.");
            return;
        }

        socket.on("notification", (notification) => {
            const { receiver, text } = notification;

            if (myId === receiver) {
                toast(text, "success", true);
            }
        });

        return () => {
            socket.off("notification");
        };
    }, [myId, toast]);

    const updateFilters = (newFilters: any) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,
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
