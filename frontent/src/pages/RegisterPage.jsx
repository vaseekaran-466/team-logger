import { Form, Formik } from 'formik';
import { Link, Navigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { authActions } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

const registerSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
      'Password must contain uppercase, lowercase, number, and special character',
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'manager' ? '/manager' : '/user'} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6 md:px-6">
      <section className="auth-card w-full max-w-[460px]">
        <div className="mb-8">
          <p className="eyebrow">Register</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Register</h2>
          <p className="muted-text mt-2 text-sm">Create your employee login details.</p>
        </div>

        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={registerSchema}
          onSubmit={(values) => {
            dispatch(
              authActions.registerRequest({
                name: values.name,
                email: values.email,
                password: values.password,
              }),
            );
          }}
        >
          <Form className="form-layout">
            <InputField label="Name" name="name" placeholder="Enter your full name" />
            <InputField label="Email" name="email" type="email" placeholder="name@company.com" />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Create a password"
            />
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />

            {error ? <div className="alert alert-error">{error}</div> : null}

            <Button disabled={loading} type="submit">
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </Form>
        </Formik>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  );
}
