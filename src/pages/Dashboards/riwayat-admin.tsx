import { useEffect, useMemo, useState } from "react";
import type { OrderList } from "../../interfaces/order";
import fetchApi from "../../lib/fetch-api";
import Loading from "../../components/Loading";
import ViewOrder from "../../components/Dashboard/OrdersUsers/ViewOrder";
import type { EventList } from "../../interfaces/event-admin";
import type { UserListAdmin } from "../../interfaces/users";

const RiwayatAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [openView, setOpenView] = useState({ id: 0, open: false });

  // Filter states
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchEventName, setSearchEventName] = useState("");
  const [searchUserName, setSearchUserName] = useState("");
  const [searchQuantity, setSearchQuantity] = useState("");
  const [searchTotalPrice, setSearchTotalPrice] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const handleMappingData = (
    orders: OrderList[],
    events: EventList[],
    users: UserListAdmin[]
  ) => {
    const mappingData: any = [];
    orders.map((order: OrderList) => {
      const event = events.find((event) => event.id === order.event_id);
      const user = users.find((user) => user.id === order.user_id);
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
      const response = await fetchApi.get(`/admin/orders`);
      const getUser = await fetchApi.get(`/admin/users`);
      const getEvent = await fetchApi.get(`/events`);
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
    setOpenView({ id: 0, open });
    fetchListEvent();
  };

  // Filtering logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const globalMatch =
        item.id.toString().includes(globalSearch) ||
        item.event_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.user_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.status.toLowerCase().includes(globalSearch.toLowerCase());

      const idMatch = item.id.toString().includes(searchId);
      const eventMatch = item.event_name.toLowerCase().includes(searchEventName.toLowerCase());
      const userMatch = item.user_name.toLowerCase().includes(searchUserName.toLowerCase());
      const qtyMatch = item.quantity.toString().includes(searchQuantity);
      const priceMatch = item.total_price.toString().includes(searchTotalPrice);
      const statusMatch = item.status.toLowerCase().includes(searchStatus.toLowerCase());

      return globalMatch && idMatch && eventMatch && userMatch && qtyMatch && priceMatch && statusMatch;
    });
  }, [
    data,
    globalSearch,
    searchId,
    searchEventName,
    searchUserName,
    searchQuantity,
    searchTotalPrice,
    searchStatus,
  ]);

  return (
    <div className="flex flex-col pr-6">
      {isLoading && <Loading />}
      {openView.open && (
        <ViewOrder id={openView.id} setOpenView={handleAfterReject} />
      )}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">Order Users</h1>
        <input
          type="text"
          placeholder="Search..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="px-3 py-2 border rounded-md shadow-sm"
        />
      </div>

      <table className="w-full mt-10 table-fixed">
        <thead>
          <tr className="w-full border">
            <th className="w-10 py-4 text-lg border">No</th>
            <th className="w-12 py-2 text-lg border">
              ID
              <input
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
                placeholder="Filter"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </th>
            <th className="w-64 py-2 text-lg border">
              Event Name
              <input
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
                placeholder="Filter"
                value={searchEventName}
                onChange={(e) => setSearchEventName(e.target.value)}
              />
            </th>
            <th className="w-32 py-2 text-lg border">
              User Name
              <input
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
                placeholder="Filter"
                value={searchUserName}
                onChange={(e) => setSearchUserName(e.target.value)}
              />
            </th>
            <th className="w-16 py-2 text-lg border">
              Quantity
              <input
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
                placeholder="Filter"
                value={searchQuantity}
                onChange={(e) => setSearchQuantity(e.target.value)}
              />
            </th>
            <th className="w-32 py-2 text-lg border">
              Total Price
              <input
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
                placeholder="Filter"
                value={searchTotalPrice}
                onChange={(e) => setSearchTotalPrice(e.target.value)}
              />
            </th>
            <th className="w-32 py-2 text-lg border">
              Status
              <input
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
                placeholder="Filter"
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
              />
            </th>
            <th className="w-24 py-4 text-lg border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr className="border" key={index}>
              <td className="px-2 py-2 text-center border">{index + 1}</td>
              <td className="px-2 py-2 text-center border">{item.id}</td>
              <td className="px-2 py-2 text-center border">{item.event_name}</td>
              <td className="px-2 py-2 text-center border">{item.user_name}</td>
              <td className="px-2 py-2 text-center border">{item.quantity}</td>
              <td className="px-2 py-2 text-right border">
                Rp. {parseInt(item.total_price).toLocaleString("en-US")}
              </td>
              <td className="px-2 py-2 text-center border">
                {item.status === "pending" && (
                  <span className="px-4 py-1 text-sm text-white bg-yellow-500 rounded-full">Pending</span>
                )}
                {item.status === "paid" && (
                  <span className="px-4 py-1 text-sm text-white bg-green-500 rounded-full">Paid</span>
                )}
                {item.status === "cancelled" && (
                  <span className="px-4 py-1 text-sm text-white bg-red-500 rounded-full">Cancel</span>
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
