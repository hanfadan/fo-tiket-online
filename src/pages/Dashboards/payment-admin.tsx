import { useEffect, useMemo, useState } from "react";
import fetchApi from "../../lib/fetch-api";
import Loading from "../../components/Loading";
import type { PaymentList } from "../../interfaces/payment";
import ViewPayment from "../../components/Dashboard/PaymentUsers/ViewPayment";

const PaymentAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PaymentList[]>([]);
  const [openView, setOpenView] = useState({
    id: 0,
    qUrls: "",
    open: false,
  });

  // Filter state
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchMethod, setSearchMethod] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const fetchListEvent = async () => {
    try {
      setIsLoading(true);
      const url = `/admin/payments`;
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
      qUrls: "",
      open,
    });
    fetchListEvent();
  };

const filteredData = useMemo(() => {
  return data.filter((item) => {
    const orderId = typeof item.order_id === "string" ? item.order_id : String(item.order_id ?? "");
    const method = typeof item.method === "string" ? item.method : "";
    const status = typeof item.status === "string" ? item.status : "";

    const globalMatch =
      orderId.toLowerCase().includes(globalSearch.toLowerCase()) ||
      method.toLowerCase().includes(globalSearch.toLowerCase()) ||
      status.toLowerCase().includes(globalSearch.toLowerCase());

    const orderIdMatch = orderId.toLowerCase().includes(searchOrderId.toLowerCase());
    const methodMatch = method.toLowerCase().includes(searchMethod.toLowerCase());
    const amountMatch = item.amount.toString().includes(searchAmount);
    const statusMatch = status.toLowerCase().includes(searchStatus.toLowerCase());

    return globalMatch && orderIdMatch && methodMatch && amountMatch && statusMatch;
  });
}, [data, globalSearch, searchOrderId, searchMethod, searchAmount, searchStatus]);


  return (
    <div className="flex flex-col pr-6">
      {isLoading && <Loading />}
      {openView.open && (
        <ViewPayment
          id={openView.id}
          qUrls={openView.qUrls}
          setOpenView={handleAfterReject}
        />
      )}

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">Payment Users</h1>
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
            <th className="w-32 py-2 text-lg border">
              Order ID
              <input
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
                placeholder="Filter"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
              />
            </th>
            <th className="w-32 py-2 text-lg border">
              Method
              <input
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
                placeholder="Filter"
                value={searchMethod}
                onChange={(e) => setSearchMethod(e.target.value)}
              />
            </th>
            <th className="w-32 py-2 text-lg border">
              Amount
              <input
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
                placeholder="Filter"
                value={searchAmount}
                onChange={(e) => setSearchAmount(e.target.value)}
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
            <th className="w-32 py-4 text-lg border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr className="border" key={index}>
              <td className="py-2 text-center border">{index + 1}</td>
              <td className="py-2 text-center border">{item.order_id}</td>
              <td className="py-2 text-center border">{item.method}</td>
              <td className="py-2 text-center border">
                Rp. {parseInt(item.amount).toLocaleString("en-US")}
              </td>
              <td className="py-2 text-center border">
                {item.status === "pending" && (
                  <span className="px-4 py-1 text-sm text-white bg-yellow-500 rounded-full">
                    Pending
                  </span>
                )}
                {item.status === "approved" && (
                  <span className="px-4 py-1 text-sm text-white bg-green-500 rounded-full">
                    Approved
                  </span>
                )}
                {item.status === "rejected" && (
                  <span className="px-4 py-1 text-sm text-white bg-red-500 rounded-full">
                    Rejected
                  </span>
                )}
              </td>
              <td className="py-2 text-center border">
                <span
                  className="px-4 py-1 text-sm text-white bg-green-500 rounded-full cursor-pointer"
                  onClick={() =>
                    setOpenView({ id: item.id, qUrls: item.qr_url, open: true })
                  }
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

export default PaymentAdmin;
