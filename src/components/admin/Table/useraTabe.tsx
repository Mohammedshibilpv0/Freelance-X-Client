import { useEffect, useState } from "react";
import Table from "./Table";
import { fetchUsers, manageUser } from "../../../api/admin/adminServices";
import useShowToast from "../../../Custom Hook/showToaster";
import Loading from "../../../style/loading";
import Pagination from "../../user/pagination/Pagination";

interface User {
  firstName: string;
  email: string;
  secondName: string;
  isBlock: boolean;
  createAt: string;
  country: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(1); 
  const limit=10
  const Toast = useShowToast();

  useEffect(() => {
    const fetchUsersData = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers(currentPage, limit); 
        setUsers(response.data.users);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, [currentPage]);

  const columns = [
    {
      header: "Full Name",
      accessor: (user: User) => `${user.firstName} ${user.secondName}`,
    },
    { header: "Email", accessor: (user: User) => user.email },
    {
      header: "Join Date",
      accessor: (user: User) => new Date(user.createAt).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: (user: User) => (user.isBlock ? "Blocked" : "Active"),
    },
    {
      header: "Action",
      accessor: (user: User) =>
        user.isBlock ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUser("unblock", user.email)}
          >
            Unblock
          </button>
        ) : (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleUser("block", user.email)}
          >
            Block
          </button>
        ),
    },
  ];

  const handleUser = async (action: string, email: string) => {
    try {
      const response = await manageUser(action, email);
      if (response.message) {
        Toast(`User ${action}ed successfully`, "success", true);
        setUsers(
          users.map((user) =>
            user.email === email
              ? { ...user, isBlock: action === "block" }
              : user
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };



  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto px-20 mt-7">
      <input
        type="text"
        className="p-2 border border-gray-300 rounded-lg w-full mb-2"
        placeholder="Search users"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Table<User>
        data={users.filter((user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        columns={columns}
      />
      <div className="flex justify-end mt-4">
      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages}/>
      </div>
    </div>
  );
};

export default UserTable;
