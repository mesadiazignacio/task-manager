import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/ErrorMessage"
import { UpdateCurrentUserPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/ProfileAPI";
import { toast } from "react-toastify";

export default function ChangePasswordView() {
  const initialValues : UpdateCurrentUserPasswordForm = {
    currentPassword: '',
    password: '',
    passwordConfirmation: ''
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: initialValues })

  const { mutate } = useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
    }
  })

  const password = watch('password');

  const handleChangePassword = (formData : UpdateCurrentUserPasswordForm) => mutate(formData)

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl">Change Password</h1>
        <p className="text-xl text-gray-500 font-normal">Here you could update your password</p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="mt-[1rem] bg-white shadow-2xl p-[4rem] rounded-lg"
          noValidate
        >
          <div className="mb-[1rem] space-y-[1rem]">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="current_password"
            >Current Password</label>
            <input
              id="current_password"
              type="password"
              placeholder="Empty"
              className="w-full p-3  border border-gray-200"
              {...register("currentPassword", {
                required: "El password actual es obligatorio",
              })}
            />
            {errors.currentPassword && (
              <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="password"
            >New Password</label>
            <input
              id="password"
              type="password"
              placeholder="Empty"
              className="w-full p-3  border border-gray-200"
              {...register("password", {
                required: "El Nuevo Password es obligatorio",
                minLength: {
                  value: 8,
                  message: 'El Password debe ser mínimo de 8 caracteres'
                }
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase font-bold"
            >Repeat New Password</label>

            <input
              id="password_confirmation"
              type="password"
              placeholder="Empty"
              className="w-full p-3  border border-gray-200"
              {...register("passwordConfirmation", {
                required: "Este campo es obligatorio",
                validate: value => value === password || 'Los Passwords no son iguales'
              })}
            />
            {errors.passwordConfirmation && (
              <ErrorMessage>{errors.passwordConfirmation.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value='Save Changes'
            className="bg-cyan-600 text-white rounded-lg w-full shadow-lg py-[1rem] border-2 border-transparent hover:bg-transparent hover:text-cyan-600 hover:border-cyan-600 transition-colors cursor-pointer duration-300"
          />
        </form>
      </div>
    </>
  )
}