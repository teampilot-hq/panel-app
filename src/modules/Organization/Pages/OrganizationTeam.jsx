import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog } from '@headlessui/react'
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { ChevronLeftIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid';

const example = [
  { name: 'Financial', count: '2' },
  { name: 'Support', count: '5' },
  { name: 'Sales', count: '3' },
  { name: 'Technical', count: '4' }
]

export default function OrganizationTeam() {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  const goBack = () => navigate('/organization');

  const viewCreateTeam = () => {
    navigate('/organization/team/create')
  }

  const updateTeam = (team) => {
    navigate('/organization/team/update/' + team)
  }

  const handleClick = (e) => {
    setSelectedTeam(e);
  }

  const handleAccept = (name) => {
    setIsProcessing(true);
    handleAccept(name).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
      example(prevState => prevState.filter(data => data.name !== name))
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    })
  }

  return (
    <div className='md:w-4/5 overflow-y-auto w-full mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-5xl'>
        <div className='flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 pb-4'>
          <div className="flex items-center">
            <button onClick={goBack}>
              <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
            </button>
            <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Teams</h1>
          </div>

          <button onClick={viewCreateTeam} className='flex items-center rounded-lg px-2 py-1 shadow-sm bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            <PlusIcon className='h-5 w-5 mr-2 text-gray-400'></PlusIcon>
            Add Team
          </button>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        <div className="p-4">
          <div className="inline-block min-w-full align-middle">
            <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {example.map((e) => (<TeamItem key={e.name} e={e} onClick={handleClick} isProcessing={isProcessing} updateTeam={updateTeam} />))}
            </ul>
          </div>
        </div>

        {selectedTeam && <DeleteModal team={selectedTeam} handleReject={() => { setSelectedTeam(null) }} handleAccept={handleAccept} />}
      </div>
    </div>
  )
}

function TeamItem({ e, isProcessing, onClick, updateTeam }) {
  return (
    <div>
      <li key={e.name} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200 shadow">
        <div className="flex flex-col w-full items-center justify-between p-6">
          <h3 className="flex items-center text-sm font-medium">{e.name}</h3>
          <p className="mt-1 text-sm text-gray-400">{e.count} members</p>
        </div>
        <div>
          <div className="-mt-px flex divide-x divide-gray- dark:divide-gray-700">
            <div className="flex w-0 flex-1">
              <button onClick={() => updateTeam(e.name)} className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-gray-200 dark:border-gray-700 py-4 text-sm font-semibold">
                <PencilSquareIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                {isProcessing ? "Waiting ..." : "Edit"}
              </button>
            </div>
            <div className="-ml-px flex w-0 flex-1">
              <button onClick={() => onClick(e)} className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-gray-200 dark:border-gray-700 py-4 text-sm font-semibold">
                <TrashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                {isProcessing ? "Waiting ..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </li>
    </div>
  )
}

function DeleteModal({ handleAccept, handleReject, team }) {
  return (
    <Dialog open={true} onClose={handleReject}>
      <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111118c] z-40'>
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 dark:text-gray-200 p-6 text-left align-middle transition-all">
            <div className='flex items-center mb-6'>
              <XMarkIcon onClick={handleReject} className='w-6 h-6 mr-2 cursor-pointer'></XMarkIcon>
              <h1 className='font-semibold'>Remove Team</h1>
            </div>

            <p className="fullname font-semibold text-sm text-center mb-12">Are you sure you want to remove the {team.name} team?</p>

            <section className='flex text-center justify-center'>
              <button onClick={handleReject} className='rounded-lg p-2 shadow-md border border-red-700 w-1/2'>No</button>
              <button onClick={() => handleAccept(team)} className='rounded-lg p-2 shadow-md ml-4 bg-red-700 w-1/2 text-white'>Yes</button>
            </section>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}