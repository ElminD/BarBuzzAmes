import CategoryFilter from '@/components/shared/CategoryFilter';
import Collection from '@/components/shared/Collection'
import Search from '@/components/shared/Search';
import { Button } from '@/components/ui/button'
import { getAllEvents, getEventsByCurrentDate } from '@/lib/actions/event.actions';
import { SearchParamProps } from '@/types';
import Image from 'next/image'
import Link from 'next/link'

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || '';
  const category = (searchParams?.category as string) || '';

  const date = new Date();

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6
  })

  const todayStartTime = new Date();
  todayStartTime.setHours(0, 0, 0, 0);
  const todayEndTime= new Date();
  todayEndTime.setHours(23, 59, 59, 999);

  const todayEvents = await getEventsByCurrentDate({
    startDateTime: date,
    todayDateStart: todayStartTime,
    todayEndDate: todayEndTime,
    page,
    limit: 3
  })

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Drink. Party. Save.</h1>
            <p className="p-regular-20 md:p-regular-24">Keep up to date on all the Welch Ave bars</p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">
                View Deals
              </Link>
            </Button>
          </div>

          <Image 
            src="/assets/images/beerman.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section> 

      <section id="today"className="wrapper my-4 flex flex-col gap-8 md:gap-12 ">
      <h2 className="h2-bold ">Today's Deals</h2>
        <div>
          <Collection 
            data={todayEvents?.data}
            emptyTitle="No Deals Today"
            emptyStateSubtext="Come back later"
            collectionType="All_Events"
            limit={3}
            page={page}
            totalPages={events?.totalPages}
            wantPagination={false}
          />
        </div>
      </section>

      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Search by <br /> Bar or Category</h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <Collection 
          data={events?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
          wantPagination={true}
        />
      </section>
    </>
  )
}