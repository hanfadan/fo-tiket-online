import React, { useContext, useEffect, useState } from "react";
import fetchApi from "../../../lib/fetch-api";
import type { OrderList } from "../../../interfaces/order";
import { UserContext } from "../../../context/user-context";

const ViewOrder: React.FC<{
  id: number;
  setOpenView: (value: boolean) => void;
}> = ({ id, setOpenView }) => {
  const [data, setData] = useState<OrderList>();

  const { currentUser } = useContext(UserContext);
  const handleReject = async (id: number) => {
    try {
      const url = `orders/${id}`;
      await fetchApi.delete(url);
      setOpenView(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        const url = `orders/${id}`;
        const response = (await fetchApi.get(url)) as any;
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getDetails();
  }, []);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/50 z-[999999] px-2"
      onClick={() => setOpenView(false)}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-xl p-6 bg-white rounded-xl"
      >
        <table className="w-full table-fixed">
          <tbody>
            <tr>
              <td>Event ID</td>
              <td>:</td>
              <td>{data?.event_id}</td>
            </tr>
            <tr>
              <td>User ID</td>
              <td>:</td>
              <td>{data?.user_id}</td>
            </tr>
            <tr>
              <td>Quantity</td>
              <td>:</td>
              <td>{data?.quantity}</td>
            </tr>
            <tr>
              <td>Total Price</td>
              <td>:</td>
              <td>
                Rp. {parseInt(data?.total_price ?? "0").toLocaleString("id-ID")}
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>:</td>
              <td>
                {data?.status === "pending" && (
                  <span className="px-4 py-1 text-sm text-white bg-yellow-500 rounded-full">
                    Pending
                  </span>
                )}
                {data?.status === "paid" && (
                  <span className="px-4 py-1 text-sm text-white bg-green-500 rounded-full">
                    Paid
                  </span>
                )}
                {data?.status === "cancelled" && (
                  <span className="px-4 py-1 text-sm text-white bg-red-500 rounded-full">
                    Cancelled
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        {currentUser.role === "user" && (
          <button
            className="mt-4 bg-red-500 text-white px-4 py-1.5 rounded-full mx-auto"
            onClick={() => handleReject(id)}
          >
            REJECT / DELETE
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewOrder;
