import ListCard from "../../components/user/Explore/ListCard";
import SideBar from "../../components/user/Explore/sideBar"; 

const Explore: React.FC = () => {
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