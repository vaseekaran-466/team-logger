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
});

export function LoginPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <div className="auth-copy">
          <p className="eyebrow">Team Logger Assessment</p>
          <h1 className="page-title">Welcome back</h1>
          <p className="page-subtitle">
            Sign in to manage daily work logs and keep your team updates in one place.
          </p>
        </div>
      </div>

      <div className="auth-card">
        <h2>Login</h2>
        <p className="muted-text">Enter your account details to continue.</p>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={(values) => {
            dispatch(authActions.loginRequest(values));
          }}
        >
          <Form className="form-layout">
            <InputField label="Email" name="email" type="email" placeholder="Enter your email" />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
            />

            {error ? <div className="alert alert-error">{error}</div> : null}

            <Button disabled={loading} type="submit">
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </Form>
        </Formik>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
