import { Form, Formik } from 'formik';
import { Link, Navigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { useAppDispatch, useAppSelector } from '../hooks';
import { authActions } from '../features/auth/authSlice';

const loginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: Yup.string().oneOf(['manager', 'employee']).required('Login type is required'),
});

export function LoginPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'manager' ? '/manager' : '/user'} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-8 md:px-8">
      <div className="w-full max-w-md rounded-[32px] border border-white/70 bg-[rgba(255,255,255,0.9)] p-8 shadow-[0_18px_45px_rgba(28,50,84,0.12)] backdrop-blur-[14px] md:p-10">
        <div className="mb-8 text-center">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-[#0f5cc0]">
            Team Logger
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your account details to continue.</p>
        </div>

        <Formik
          initialValues={{ email: '', password: '', role: 'employee' }}
          validationSchema={loginSchema}
          onSubmit={(values) => {
            dispatch(authActions.loginRequest(values));
          }}
        >
          <Form className="grid gap-5">
            <InputField label="Login Type" name="role" as="select">
              <option value="employee">User</option>
              <option value="manager">Manager</option>
            </InputField>
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
            />

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-[0.95rem] text-red-700">
                {error}
              </div>
            ) : null}

            <Button className="mt-2 w-full justify-center" disabled={loading} type="submit">
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </Form>
        </Formik>

        <div className="mt-8 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link className="font-semibold text-[#0f5cc0] no-underline hover:underline" to="/register">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
