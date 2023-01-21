import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/utils';
import { SignInForm } from '@/types';
import { signInSchema } from '@/schema';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSetRecoilState } from 'recoil';
import { alertState } from '@/state';
import { themes } from '@/consts';
import { useTheme } from '@/hooks';

export default function SignIn() {
  const [theme, handleThemeChange] = useTheme();
  const setAlert = useSetRecoilState(alertState);
  const router = useRouter();
  const loginMutation = trpc.user.login.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInForm> = async (data) => {
    const { user, status, message } = await loginMutation.mutateAsync(data);

    setAlert({
      message,
      isOpen: true,
      type: status ? 'success' : 'error',
    });
    if (user) router.push(`/${user.role}`);
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <select
        className="select absolute top-2 right-2"
        onChange={handleThemeChange}
        value={theme}
      >
        <option value="" defaultValue="" hidden>
          Theme
        </option>
        {themes.map((themeItem) => (
          <option value={themeItem} key={themeItem}>
            {themeItem}
          </option>
        ))}
        <option value="dark">Dark</option>
      </select>
      <div className="card w-1/3 bg-base-100 shadow-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-body grid gap-4"
        >
          <h1 className="card-title">Sign In</h1>
          <div>
            <input
              type="text"
              placeholder="Email"
              className={`input input-bordered w-full ${
                errors.email ? ' input-error' : ''
              }`}
              {...register('email')}
            />
            <small className="text-error">{errors.email?.message}</small>
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`input input-bordered w-full ${
                errors.password ? ' input-error' : ''
              }`}
              {...register('password')}
            />
            <small className="text-error">{errors.password?.message}</small>
          </div>
          <button type="submit" className="btn btn-primary">
            Sign In
          </button>
          <div className="flex justify-center gap-1">
            <span>Don&apos;t have an account?</span>{' '}
            <Link href="/auth/sign-up" className="font-bold">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
