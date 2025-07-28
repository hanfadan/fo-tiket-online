import { useEffect, useState } from "react";
// import image from "../../assets/posters/Poster 1 1.png";
import type { OrderList } from "../../interfaces/order";
import fetchApi from "../../lib/fetch-api";
import Loading from "../../components/Loading";
import ViewOrder from "../../components/Dashboard/OrdersUsers/ViewOrder";
import type { EventList } from "../../interfaces/event-admin";
import type { UserListAdmin } from "../../interfaces/users";

const RiwayatAdmin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [openView, setOpenView] = useState({
    id: 0,
    open: false,
  });

  const handleMappingData = (
    orders: OrderList[],
    events: EventList[],
    users: UserListAdmin[]
  ) => {
    const mappingData: any = [];
    orders.map((order: OrderList) => {
      const event = events.find(
        (event: EventList) => event.id === order.event_id
      );
      const user = users.find(
        (user: UserListAdmin) => user.id === order.user_id
      );
      if (event) {
        mappingData.push({
          ...order,
          event_name: event.name,
          user_name: user?.name,
        });
      }
    });
    return mappingData;
  };

  const fetchListEvent = async () => {
    try {
      setIsLoading(true);
      const url = `/admin/orders`;
      const response = (await fetchApi.get(url)) as any;
      const getUser = (await fetchApi.get(`/admin/users`)) as any;
      const getEvent = (await fetchApi.get(`/events`)) as any;
      const dataMapping = handleMappingData(
        response.data,
        getEvent.data,
        getUser.data
      );
      setData(dataMapping);
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

  return (
    <div className="flex flex-col pr-6">
      {isLoading && <Loading />}
      {openView.open && (
        <ViewOrder id={openView.id} setOpenView={handleAfterReject} />
      )}
      <h1 className="text-4xl font-bold">Order Users </h1>
      <table className="w-full mt-10 table-fixed">
        <thead>
          <tr className="w-full border">
            <th className="w-10 py-4 text-lg border">No</th>
            <th className="w-12 py-4 text-lg border">ID</th>
            <th className="w-64 py-4 text-lg border">Event Name</th>
            <th className="w-32 py-4 text-lg border">User Name</th>
            <th className="w-16 py-4 text-lg border">Quantity</th>
            <th className="w-32 py-4 text-lg border">Total Price</th>
            <th className="w-32 py-4 text-lg border">Status</th>
            <th className="w-24 py-4 text-lg border">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr className="border" key={index}>
              <td className="px-2 py-2 text-center border">{index + 1}</td>
              <td className="px-2 py-2 text-center border">{item.id}</td>
              <td className="px-2 py-2 text-center border">
                {item.event_name}
              </td>
              <td className="px-2 py-2 text-center border">{item.user_name}</td>
              <td className="px-2 py-2 text-center border">{item.quantity}</td>
              <td className="px-2 py-2 text-right border">
                Rp. {parseInt(item.total_price).toLocaleString("en-US")}
              </td>
              <td className="px-2 py-2 text-center border">
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
                    Cancel
                  </span>
                )}
              </td>
              <td className="px-2 py-2 text-center border">
                <span
                  className="px-4 py-1 text-sm text-white bg-green-500 rounded-full cursor-pointer"
                  onClick={() => setOpenView({ id: item.id, open: true })}
                >
                  View
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiwayatAdmin;
