import CardsEvent from "../CardEvents/Index";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import fetchApi from "../../lib/fetch-api";
import type { EventList } from "../../interfaces/event-admin";
import Skeleton from "../Skeleton";

const EventSection = () => {
  const [eventData, setEventData] = useState<EventList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [getMessageNotFound, setGetMessageNotFound] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchApi.get("/events");
        const filters = response.data.filter(
          (item: any) =>
            new Date(item.event_date).toISOString().slice(0, 10) >=
            new Date().toISOString().slice(0, 10)
        );
        setEventData(filters.slice(0, 3));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="flex flex-col w-full max-w-[1480px] gap-10 px-2 py-10 mx-auto overflow-scroll lg:py-20 md:py-16">
      <div className="flex items-center justify-center gap-4 max-w-[1184px] mx-auto">
        <h1 className="text-4xl text-center lg:text-6xl ">
          Mau ikut yang mana? Pilih event <br /> yang paling kamu suka!
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-5 lg:mt-20 lg:grid-cols-3 card">
        {isLoading &&
          [1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 items-start justify-between w-full pb-4 max-w-[473px] lg:min-h-[844px] min-h-[600px] border border-slate-400 p-5 rounded-3xl"
            >
              <Skeleton className="py-5 min-h-[600px] rounded-xl" />
              <Skeleton className="py-5" />
              <div className="grid justify-between w-full grid-cols-2 gap-4">
                <Skeleton className="py-5" />
                <Skeleton className="py-5" />
              </div>
              <Skeleton />
            </div>
          ))}
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
      <div className="flex items-center justify-center py-3 mt-20">
        <Link
          to="/event"
          className="flex items-center gap-6 px-6 py-2 lg:text-[48px] text-white rounded-full bg-primary"
        >
          Cek ketersediaan tiket!
          <FaArrowRightLong />
        </Link>
      </div>
    </section>
  );
};

export default EventSection;
