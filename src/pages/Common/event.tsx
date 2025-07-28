import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import { cn } from "../../lib/utils";
import Skeleton from "../../components/Skeleton";
import fetchApi from "../../lib/fetch-api";
import type { EventList } from "../../interfaces/event-admin";
import CardsEvent from "../../components/CardEvents/Index";
const Event = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("upcoming");
  const [eventDataTemp, setEventDataTemp] = useState<EventList[]>([]);
  const [eventData, setEventData] = useState<EventList[]>([]);
  const [badgeList, setBadgeList] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [getMessageNotFound, setGetMessageNotFound] = useState("");

  const handleEventClick = (event: string) => {
    setSelectedEvent(event);
  };

  const fetchData = async () => {
    setIsLoading(true);
    setEventData([]);
    setBadgeList([]);
    setGetMessageNotFound("");
    try {
      const response = await fetchApi.get("/events");

      if (selectedEvent === "upcoming") {
        const filters = response.data.filter(
          (item: any) =>
            new Date(item.event_date).toISOString().slice(0, 10) >=
            new Date().toISOString().slice(0, 10)
        );
        if (filters.length === 0) {
          setGetMessageNotFound("Tidak ada event yang akan datang");
        }
        setBadgeList(filters.map((item: any) => item.city));
        setEventDataTemp(filters);
        setEventData(filters);
      } else {
        const filters = response.data.filter(
          (item: any) =>
            new Date(item.event_date).toISOString().slice(0, 10) <
            new Date().toISOString().slice(0, 10)
        );
        if (filters.length === 0) {
          setGetMessageNotFound("Tidak ada event yang telah berakhir");
        }
        setBadgeList(filters.map((item: any) => item.city));
        setEventDataTemp(filters);
        setEventData(filters);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedEvent]);

  const HandleFilterByCity = (city: string) => {
    if (search === city) {
      setEventData(eventDataTemp);
      setSearch("");
      return;
    }
    const filterBycity = eventDataTemp.filter((item) => item.city === city);

    setSearch(city);
    setEventData(filterBycity);
  };

  const HandleFilterByName = (name: string) => {
    const filterByName = eventDataTemp.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
    setEventData(filterByName);
  };

  return (
    <section className="flex flex-col w-full max-w-[1480px] gap-10 px-2 py-20 mx-auto overflow-scroll lg:py-32">
      <div className="flex flex-col items-center justify-center w-full gap-1">
        <h1 className="text-3xl font-bold text-slate-700">Event Kami</h1>
        <p className="text-lg text-center text-slate-700">
          Semua event yang diselenggarakan oleh Menata Hati!
        </p>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const search = e.currentTarget.search.value;
            HandleFilterByName(search);
          }}
          className="relative flex items-center justify-center w-full max-w-xl mt-4"
        >
          <Input
            type="text"
            name="search"
            placeholder="Cari Event by Name..."
            id="search"
            className="w-full px-2 py-2 mx-auto text-xl border rounded-md focus:outline-slate-600"
          />
          <span className="absolute text-lg right-2 text-slate-600">
            <FaSearch />
          </span>
        </form>
        <div className="grid w-full max-w-xl grid-cols-2 gap-6 mt-2 ">
          <button
            onClick={() => handleEventClick("upcoming")}
            className={cn(
              "flex items-center justify-center w-full py-2 text-white rounded-lg bg-disabled",
              selectedEvent === "upcoming" && "bg-primary"
            )}
          >
            Upcoming Event
          </button>
          <button
            onClick={() => handleEventClick("past")}
            className={cn(
              "flex items-center justify-center w-full py-2 text-white rounded-lg bg-disabled",
              selectedEvent === "past" && "bg-primary"
            )}
          >
            Past Event
          </button>
        </div>
      </div>
      <div className="flex items-center justify-start w-full gap-4 overflow-scroll lg:justify-center">
        {isLoading &&
          Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="px-10 py-4 w-fit"></Skeleton>
            ))}
        {badgeList.map((item, index) => (
          <Badge
            key={index}
            onClick={() => HandleFilterByCity(item)}
            className="cursor-pointer"
          >
            {item}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 card">
        {isLoading &&
          Array(10)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-start justify-between w-full pb-4 max-w-[473px] lg:min-h-[460px] min-h-[400px] border border-slate-400 p-5 rounded-3xl"
              >
                <Skeleton className="py-5 min-h-[200px] rounded-xl" />
                <Skeleton className="py-5" />
                <div className="grid justify-between w-full grid-cols-2 gap-4">
                  <Skeleton className="py-5" />
                  <Skeleton className="py-5" />
                </div>
                <Skeleton />
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 card">
        {eventData.map((event, index) => (
          <div key={index} className="w-full">
            <CardsEvent
              poster_url={event.poster_url}
              name={event.name}
              city={event.city}
              description={event.description}
              address={event.address}
              id={event.id}
              venue={event.venue}
              regular_price={event.regular_price}
              vip_price={event.vip_price}
              event_date={event.event_date}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center mt-10">
        <p className="text-4xl font-semibold">{getMessageNotFound}</p>
      </div>
    </section>
  );
};

export default Event;
