import { useEffect, useMemo, useState } from "react";
import fetchApi from "../../../lib/fetch-api";
import Loading from "../../../components/Loading";
import type { UserListAdmin } from "../../../interfaces/users";
import Button from "../../../components/ui/Button";
import UserCreated from "../../../components/Dashboard/UsersAdmin/users-create";

const UsersAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<UserListAdmin[]>([]);
  const [create, setCreate] = useState(false);

  // Filter states
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");

  const fetchListEvent = async () => {
    setIsLoading(true);
    const url = `/admin/users`;
    const response = (await fetchApi.get(url)) as any;
    setData(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchListEvent();
  }, []);

  const handleSuccesCreated = () => {
    fetchListEvent();
    setCreate(false);
  };

  const handleChangeRole = async (id: number, role: string) => {
    const url = `/admin/users/${id}/role`;
    await fetchApi.patch(url, { role });
    fetchListEvent();
  };

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const globalMatch =
        item.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.role.toLowerCase().includes(globalSearch.toLowerCase());

      const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
      const emailMatch = item.email.toLowerCase().includes(searchEmail.toLowerCase());
      const roleMatch = item.role.toLowerCase().includes(searchRole.toLowerCase());

      return globalMatch && nameMatch && emailMatch && roleMatch;
    });
  }, [data, globalSearch, searchName, searchEmail, searchRole]);

  return (
    <div className="flex flex-col pr-6">
      {isLoading && <Loading />}
      <UserCreated create={create} setCreate={handleSuccesCreated} />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">Users</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="px-3 py-2 border rounded-md shadow-sm"
          />
          <Button
            onClick={() => setCreate(true)}
            className="px-4 py-2 text-white rounded-md bg-primary w-fit"
          >
            Create
          </Button>
        </div>
      </div>

      <table className="w-full mt-10 table-fixed">
        <thead>
          <tr className="w-full border">
            <th className="w-10 py-4 text-lg border">No</th>
            <th className="w-64 py-2 text-lg border">
              Name
              <input
                type="text"
                placeholder="Filter Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
              />
            </th>
            <th className="w-64 py-2 text-lg border">
              Email
              <input
                type="text"
                placeholder="Filter Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
              />
            </th>
            <th className="w-32 py-2 text-lg border">
              Role
              <input
                type="text"
                placeholder="Filter Role"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
              />
            </th>
            <th className="w-48 py-4 text-lg border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr className="border" key={index}>
              <td className="px-2 py-2 text-center border">{index + 1}</td>
              <td className="px-2 py-2 text-center border">{item.name}</td>
              <td className="px-2 py-2 text-center border">{item.email}</td>
              <td className="px-2 py-2 text-center border">
                {item.role === "admin" && (
                  <span className="px-4 py-1 text-sm text-white bg-yellow-500 rounded-full">
                    Admin
                  </span>
                )}
                {item.role === "user" && (
                  <span className="px-4 py-1 text-sm text-white bg-green-500 rounded-full">
                    User
                  </span>
                )}
              </td>
              <td className="px-2 py-2 text-center border">
                <span className="relative px-4 py-1 text-sm text-white rounded-full cursor-pointer group bg-primary w-fit">
                  Change Role
                  <div className="absolute group-hover:flex hidden top-[100%] z-[999999] right-0 w-full bg-white drop-shadow-xl min-w-36 rounded-md justify-center items-center">
                    <div className="flex flex-col items-center w-full gap-2 px-2 py-2">
                      <Button
                        onClick={() => handleChangeRole(item.id, "admin")}
                        className="w-full px-4 py-1 text-white bg-yellow-500 rounded-md"
                      >
                        Admin
                      </Button>
                      <Button
                        onClick={() => handleChangeRole(item.id, "user")}
                        className="w-full px-4 py-1 text-white bg-green-500 rounded-md"
                      >
                        User
                      </Button>
                    </div>
                  </div>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersAdmin;
