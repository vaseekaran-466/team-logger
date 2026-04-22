import { Form, Formik } from 'formik';
import { Link, Navigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { useAppDispatch, useAppSelector } from '../hooks';
import { authActions } from '../features/auth/authSlice';

const registerSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export function RegisterPage() {
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
          <h1 className="page-title">Create your account</h1>
          <p className="page-subtitle">
            Set up your employee account to start adding daily work logs.
          </p>
        </div>
      </div>

      <div className="auth-card">
        <h2>Register</h2>
        <p className="muted-text">Create your employee login details.</p>

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
            <InputField label="Name" name="name" placeholder="Enter your name" />
            <InputField label="Email" name="email" type="email" placeholder="Enter your email" />
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
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </Form>
        </Formik>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
