import { Form, Formik } from 'formik';
import { Link, Navigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { authActions } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

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
    <div className="flex min-h-screen items-center justify-center px-4 py-6 md:px-6">
      <section className="auth-card w-full max-w-[460px]">
        <div className="mb-8">
          <p className="eyebrow">Sign In</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Sign in</h2>
          <p className="muted-text mt-2 text-sm">Use your account details to continue.</p>
        </div>

        <Formik
          initialValues={{ email: '', password: '', role: 'employee' }}
          validationSchema={loginSchema}
          onSubmit={(values) => {
            dispatch(authActions.loginRequest(values));
          }}
        >
          <Form className="form-layout">
            <InputField label="Login Type" name="role" as="select">
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </InputField>
            <InputField label="Email" name="email" type="email" placeholder="name@company.com" />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
            />

            {error ? <div className="alert alert-error">{error}</div> : null}

            <Button className="mt-2 w-full justify-center" disabled={loading} type="submit">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Form>
        </Formik>

        <div className="mt-7 border-t border-[#e3e8f0] pt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link className="font-semibold text-slate-900 no-underline hover:underline" to="/register">
            Create one
          </Link>
        </div>
      </section>
    </div>
  );
}
