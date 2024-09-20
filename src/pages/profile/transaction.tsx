
import { useEffect, useState } from 'react';
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import Store from '../../store/store';
import Pagination from "../../components/user/pagination/Pagination";
import { myTransaction } from '../../api/user/userServices';

export interface IPaymentTransaction {
    _id: string;
    senderId: {
        _id: string;
        firstName: string;
        secondName: string;
    };
    receiverId: {
        _id: string;
        firstName: string;
        secondName: string;
    };
    amount: string;
    createdAt: Date;
}


const Transaction = () => {
  const userId = Store((config) => config.user._id);
  const [transactions, setTransactions] = useState<IPaymentTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const limit = 10; 

  useEffect(() => {
    const fetchTransactions = async (page: number) => {
      try {
        const response = await myTransaction(userId, page, limit);
        console.log(response)
        setTransactions(response.transactionHistory);
        setTotalTransactions(response.totalPages); 
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions(currentPage);
  }, [userId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
    <div className="relative overflow-x-auto mt-10 w-full">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Transaction ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Sender Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Receiver Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Amount
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Type
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {transaction._id}
                            </td>
                            <td className="px-6 py-4">
                                {transaction.senderId._id === userId ? 'You' : `${transaction.senderId.firstName} ${transaction.senderId.secondName}`}
                            </td>
                            <td className="px-6 py-4">
                                {transaction.receiverId._id === userId ? 'You' : `${transaction.receiverId.firstName} ${transaction.receiverId.secondName}`}
                            </td>
                            <td className="px-6 py-4"> {transaction.amount}</td>
                            <td className="px-6 py-4">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                                {transaction.senderId._id === userId ? (
                                    <span className="flex items-center text-red-500">
                                        <AiOutlineArrowDown className="mr-2" />
                                        Money Sent
                                    </span>
                                ) : (
                                    <span className="flex items-center text-green-500">
                                        <AiOutlineArrowUp className="mr-2" />
                                        Money Received
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
         <div className="mt-4">
         {transactions.length!==0&&(
            <Pagination
            currentPage={currentPage}
            totalPages={totalTransactions}
            onPageChange={handlePageChange}
        />
         )}
     </div>
     </>
  );
};

export default Transaction;
