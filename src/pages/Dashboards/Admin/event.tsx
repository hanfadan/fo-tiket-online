import { useEffect, useState, useMemo } from "react";
import Button from "../../../components/ui/Button";
import fetchApi from "../../../lib/fetch-api";
import EventCreate from "../../../components/Dashboard/EventAdmin/event-create";
import type { EventList } from "../../../interfaces/event-admin";
import EventEdit from "../../../components/Dashboard/EventAdmin/event-edit";
import Loading from "../../../components/Loading";
import { urlPath } from "../../../lib/url-path";

const EventAdmin = () => {
  const [create, setCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<EventList[]>([]);
  const [edit, setEdit] = useState({ id: 0, open: false });

  // Filter state per kolom
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchVenue, setSearchVenue] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const fetchListEvent = async () => {
    setIsLoading(true);
    const url = `events`;
    const response = (await fetchApi.get(url)) as any;
    setData(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchListEvent();
  }, []);

  const handleClose = () => {
    fetchListEvent();
    setEdit({ id: 0, open: false });
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to delete this?");
    if (!confirm) return;
    setIsLoading(true);
    const url = `events/${id}`;
    await fetchApi.delete(url);
    fetchListEvent();
  };

  const handleSuccessCreated = () => {
    fetchListEvent();
    setCreate(false);
  };

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const globalMatch =
        item.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.city.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.venue.toLowerCase().includes(globalSearch.toLowerCase()) ||
        item.address.toLowerCase().includes(globalSearch.toLowerCase());

      const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
      const cityMatch = item.city.toLowerCase().includes(searchCity.toLowerCase());
      const venueMatch = item.venue.toLowerCase().includes(searchVenue.toLowerCase());
      const locationMatch = item.address.toLowerCase().includes(searchLocation.toLowerCase());

      return globalMatch && nameMatch && cityMatch && venueMatch && locationMatch;
    });
  }, [data, globalSearch, searchName, searchCity, searchVenue, searchLocation]);

  return (
    <div className="flex flex-col w-full min-h-screen pr-6 overflow-scroll ">
      {isLoading && <Loading />}
      <EventCreate create={create} setCreate={handleSuccessCreated} />
      {edit.open && <EventEdit id={edit.id} close={handleClose} />}

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">Event</h1>
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
          <tr className="border">
            <th className="w-10 py-4 text-lg border">No</th>
            <th className="w-32 py-4 text-lg border">Poster</th>
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
            <th className="w-32 py-2 text-lg border">
              City
              <input
                type="text"
                placeholder="Filter City"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
              />
            </th>
            <th className="w-48 py-2 text-lg border">
              Venue
              <input
                type="text"
                placeholder="Filter Venue"
                value={searchVenue}
                onChange={(e) => setSearchVenue(e.target.value)}
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
              />
            </th>
            <th className="w-64 py-2 text-lg border">
              Location
              <input
                type="text"
                placeholder="Filter Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-2 py-1 mt-1 text-sm border rounded"
              />
            </th>
            <th className="w-64 py-4 text-lg border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id} className="border">
              <td className="py-2 text-center border">{index + 1}</td>
              <td className="py-2 text-center border">
                <div className="flex justify-center">
                  <img src={urlPath(item.poster_url)} alt="" className="h-24" />
                </div>
              </td>
              <td className="py-2 text-center border">{item.name}</td>
              <td className="py-2 text-center border">{item.city}</td>
              <td className="py-2 text-center border">{item.venue}</td>
              <td className="py-2 text-center border">{item.address}</td>
              <td className="py-2 text-center border">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    className="px-4 py-2 text-white bg-yellow-500 rounded-md w-fit"
                    onClick={() => setEdit({ id: item.id, open: true })}
                  >
                    Edit
                  </Button>
                  <Button
                    className="px-4 py-2 text-white bg-red-500 rounded-md w-fit"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventAdmin;
