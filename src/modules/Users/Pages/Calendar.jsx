import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import { daysoff } from "../../../services/WorkiveApiClient.js"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { leaveTypeJson, statusJson, leaveTypeColor, dayoffStatusColor } from '../../../constants/index.js'
import '../../../constants/style.css'
import { Toolbar, Label } from '~/core/components'
import useCalendarData from '../../../utils/holidays.js';
import { PlusIcon } from '@heroicons/react/20/solid';
dayjs.extend(isBetween);

const myStyles = {
  dayPicker: {
    '@media (min-width: 768px)': {
      minWidth: '768px'
    }
  },
  day: {
    padding: '20px',
    margin: "7px 10px",
    fontSize: '18px'
  },
  head: {
    fontSize: '18px'
  },
  caption: {
    margin: "7px"
  }
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [requestsList, setRequestsList] = useState([])
  const [offDays, setOffDays] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const { calendarCurrentDate, setCalendarCurrentDate, holidaysDate } = useCalendarData();
  const navigate = useNavigate();
  const selectedDateRequests = requestsList.filter(r => (dayjs(selectedDate).isBetween(dayjs(r.startAt), dayjs(r.endAt), 'days', '[]')));
  const isWorkingDay = holidaysDate.every(d => !dayjs(d).isSame(selectedDate, 'day'))
  const formattedSelectedDate = dayjs(selectedDate).format('YYYY-MM-DD');
  const formattedHolidaysDate = holidaysDate.map(date => dayjs(date).format('YYYY-MM-DD'));

  //Get list of requests
  useEffect(() => {
    daysoff().then(data => {
      console.log('Success:', data.contents);
      setRequestsList(data.contents)
    }).catch(error => {
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    })
  }, [])

  // show dayoff lists of working days
  const result = [];
  useEffect(() => {
    if (requestsList.length == 0) return;

    const monthDays = calendarCurrentDate.endOf('month').format('D');
    for (let i = 1; i <= monthDays; i++) {
      const currentDate = dayjs(calendarCurrentDate).date(i);
      const isHoliday = holidaysDate.some(date => dayjs(date).isSame(currentDate, 'day'));
      if (isHoliday) continue;
      const off = requestsList.filter(r => currentDate.isBetween(dayjs(r.startAt), dayjs(r.endAt), 'days', '[]'));
      if (off.length > 0) {
        result.push(currentDate.toDate())
      }
    }
    setOffDays(result)
  }, [requestsList, calendarCurrentDate, offDays])

  const handleMonthChange = (newDate) => {
    setCalendarCurrentDate(dayjs(newDate));
  }

  const showDayOff = (date) => {
    if (date) setSelectedDate(date)
  }

  const sendRequest = () => {
    navigate('/dayoff/create');
  }


  return (
    <div className='md:w-4/5 w-full fixed top-16 md:top-0 bottom-0 right-0 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-indigo-900 dark:text-indigo-200'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-[70%]'>
        <Toolbar title='Calendar'>
          <div className='flex justify-center'>
            <button onClick={() => sendRequest()} className="flex items-center w-full rounded-xl bg-indigo-600 p-2 text-sm font-semibold text-indigo-100 shadow-sm hover:bg-indigo-700">
              <PlusIcon className='h-5 w-5 mr-2 text-indigo-300'></PlusIcon>
              Request Day Off
            </button>
          </div>
        </Toolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

        <main className='px-4'>
          <DayPicker modifiers={{ highlighted: offDays, holiday: holidaysDate }} modifiersStyles={{ highlighted: { backgroundColor: '#a5b4fc' }, holiday: { color: '#ef4444' } }} modifiersClassNames={{ today: 'my-today', selected: 'my-selected' }}
            onMonthChange={handleMonthChange} selected={dayjs(selectedDate).toDate()} onSelect={showDayOff}
            styles={myStyles} mode="single" className='my-styles border border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800 rounded-md flex justify-center py-2 mx-auto max-w-lg'></DayPicker>

          <div>
            <p className='font-semibold md:text-lg my-4 text-indigo-900 dark:text-indigo-200'>
              Requests ({formattedHolidaysDate.includes(formattedSelectedDate) ? 0 : selectedDateRequests.length})
            </p>
            {isWorkingDay ? selectedDateRequests.map((request) => <RequesItem request={request} key={request.id} />) : ''}
          </div>
        </main>
      </div>
    </div>
  )
}

function RequesItem({ request }) {
  return (
    <section className='flex items-center text-indigo-900 dark:text-indigo-200 mb-2 pb-2 border-b border-gray-200 dark:border-gray-800'>
      <img className="h-10 w-10 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />

      <div className='flex flex-col md:flex-row justify-between w-full'>
        <p className="fullname text-sm font-semibold mb-1 md:mb-0 md:w-1/4">Mohsen Karimi</p>

        <div className='flex flex-col md:flex-row md:w-3/4 md:justify-between'>
          <div className='flex text-xs md:text-sm mb-2 md:mb-0 md:w-full md:justify-center'>
            <p className='mr-2'>{request.distance == 1 ? dayjs(request.startAt).format('D MMM') : `${dayjs(request.startAt).format('D MMM')} - ${dayjs(request.endAt).format('D MMM')}`}</p>
            <p className='distance text-indigo-800 dark:text-indigo-300'>({(request.distance) == 1 ? "Day" : "Days"})</p>
          </div>

          <div className='flex gap-2 md:w-full md:justify-end md:gap-4'>
            <Label type={leaveTypeColor[request.type]} text={leaveTypeJson[request.type]}></Label>
            <Label type={dayoffStatusColor[request.status]} text={statusJson[request.status]}></Label>
          </div>

        </div>
      </div>
    </section>
  )
}