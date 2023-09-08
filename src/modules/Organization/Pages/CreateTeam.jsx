import { useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { createEmployee } from "../../../services/WorkiveApiClient.js"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { Button } from '~/core/components'
import { ChevronLeftIcon } from "@heroicons/react/24/outline"

const example = [
  { name: 'Financial', count: '2' },
  { name: 'Support', count: '5' },
  { name: 'Sales', count: '3' },
  { name: 'Technical', count: '4' }
]

export default function CreateTeam() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const goBack = () => navigate('/organization/team');

  const onSubmit = (data) => {
    createTeam(data)
  }

  const createTeam = (data) => {
    const exists = example.some(e => e.name === data.team);
    if (exists) {
      setErrorMessage('A team already exists with this name.');
      return
    }

    let payload = {
      teamName: data.team,
    }
    setIsProcessing(true);

    createEmployee(payload).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    })
  }


  return (
    <div className='md:w-4/5 w-full overflow-y-auto mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Create Team</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <form className="space-y-4 px-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="team" className="block text-sm font-semibold leading-6 md:text-base">Team Name</label>
            <div className="mt-2">
              <input {...register("team", { required: "Team Name is required", maxLength: { value: 20, message: "Team Name must be under 20 characters" }, minLength: { value: 2, message: "Team Name must be over 2 characters" } })}
                aria-invalid={errors.team ? "true" : "false"} name="team" type="text"
                className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
              {errors.team && <Alert>{errors.team.message}</Alert>}
            </div>
          </div>

          <Button type='submit' isProcessing={isProcessing} text='Create' className=' flex justify-center w-full md:w-1/4'></Button>
        </form>
      </div>
    </div>
  )
}

function Alert({ children }) {
  return (
    <p className="text-sm font-medium leading-6 text-red-800 mt-2" role="alert">{children}</p>
  )
}