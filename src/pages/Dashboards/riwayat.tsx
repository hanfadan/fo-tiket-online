import { useEffect, useState } from "react";
import type { OrderList } from "../../interfaces/order";
import fetchApi from "../../lib/fetch-api";
import Loading from "../../components/Loading";
import ViewOrder from "../../components/Dashboard/OrdersUsers/ViewOrder";
import ViewTiket from "../../components/Dashboard/OrdersUsers/ViewTiket";

const Riwayat = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<OrderList[]>([]);
  const [openView, setOpenView] = useState({
    id: 0,
    open: false,
  });
  const [openTicket, setOpenTicket] = useState({
    id: 0,
    open: false,
  });

  const fetchListEvent = async () => {
    try {
      setIsLoading(true);
      const url = `/orders`;
      const response = (await fetchApi.get(url)) as any;
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchListEvent();
  }, []);

  const handleAfterReject = (open: boolean) => {
    setOpenView({
      id: 0,
      open: open,
    });
    fetchListEvent();
  };

  const handleCloseTicket = () => {
    setOpenTicket({
      id: 0,
      open: false,
    });
    fetchListEvent();
  };

  return (
    <div className="flex flex-col pr-6">
      {isLoading && <Loading />}
      {openView.open && (
        <ViewOrder id={openView.id} setOpenView={handleAfterReject} />
      )}
      {openTicket.open && (
        <ViewTiket id={openTicket.id} closed={() => handleCloseTicket()} />
      )}

      <h1 className="text-4xl font-bold">Order </h1>
      <table className="w-full mt-10 table-fixed">
        <thead>
          <tr className="w-full border">
            <th className="w-10 py-4 text-lg border">No</th>
            <th className="w-64 py-4 text-lg border">EventID</th>
            <th className="w-32 py-4 text-lg border">User ID</th>
            <th className="w-32 py-4 text-lg border">Quantity</th>
            <th className="w-32 py-4 text-lg border">Total Price</th>
            <th className="w-32 py-4 text-lg border">Status</th>
            <th className="w-64 py-4 text-lg border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr className="border" key={index}>
              <td className="py-2 text-center border">{index + 1}</td>
              <td className="py-2 text-center border">{item.event_id}</td>
              <td className="py-2 text-center border">{item.user_id}</td>
              <td className="py-2 text-center border">{item.quantity}</td>
              <td className="py-2 text-center border">
                Rp. {parseInt(item.total_price).toLocaleString("en-US")}
              </td>
              <td className="py-2 text-center border">
                {item.status === "pending" && (
                  <span className="px-4 py-1 text-sm text-white bg-yellow-500 rounded-full">
                    Pending
                  </span>
                )}
                {item.status === "paid" && (
                  <span className="px-4 py-1 text-sm text-white bg-green-500 rounded-full">
                    Paid
                  </span>
                )}
                {item.status === "cancelled" && (
                  <span className="px-4 py-1 text-sm text-white bg-red-500 rounded-full">
                    Cancelled
                  </span>
                )}
              </td>
              <td className="py-2 text-center border">
                <span
                  className="px-4 py-1 text-sm text-white bg-blue-500 rounded-full cursor-pointer"
                  onClick={() => setOpenTicket({ id: item.id, open: true })}
                >
                  View Ticket
                </span>
                <span
                  className="px-4 py-1 ml-4 text-sm text-white bg-green-500 rounded-full cursor-pointer"
                  onClick={() => setOpenView({ id: item.id, open: true })}
                >
                  View Detail
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Riwayat;
