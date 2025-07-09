import React, { useEffect, useState } from "react";
import fetchApi from "../../../lib/fetch-api";
import type { PaymentList } from "../../../interfaces/payment";
import { urlPath } from "../../../lib/url-path";

const ViewPayment: React.FC<{
  id: number;
  qUrls: string;
  setOpenView: (value: boolean) => void;
}> = ({ id, qUrls, setOpenView }) => {
  const [data, setData] = useState<PaymentList>();

const handleApproved = async (action: 'approve' | 'reject') => {
  const url = `/admin/payments/${id}`;
  await fetchApi.patch(url, { action });
  setOpenView(false);
};
console.log('VITE_API_BASE_URL =', import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const url = `/admin/payments/${id}`;
        const response = (await fetchApi.get(url)) as any;
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getDetails();
  }, [id]);

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
              <td>Order ID</td>
              <td>:</td>
              <td>{data?.order_id}</td>
            </tr>
            <tr>
              <td>Method</td>
              <td>:</td>
              <td>{data?.method}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>:</td>
              <td>
                Rp. {parseInt(data?.amount ?? "0").toLocaleString("id-ID")}
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
                {data?.status === "approved" && (
                  <span className="px-4 py-1 text-sm text-white bg-green-500 rounded-full">
                    Approved
                  </span>
                )}
                {data?.status === "rejected" && (
                  <span className="px-4 py-1 text-sm text-white bg-red-500 rounded-full">
                    Rejected
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-center py-5">
          <img src={urlPath(qUrls)} alt="" className="w-full" />
        </div>
        <div className="grid gap-2 lg:gap-5 lg:grid-cols-2">
          <button
            className=" bg-green-500 text-white px-4 py-1.5 lg:py-3 rounded-full mx-auto w-full"
            onClick={() => handleApproved('approve')}
          >
            Approve
          </button>
          <button
            className=" bg-red-500 text-white px-4 py-1.5 lg:py-3 rounded-full mx-auto w-full"
            onClick={() => handleApproved('reject')}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPayment;
