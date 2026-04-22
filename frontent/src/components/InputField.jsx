import { ErrorMessage, Field } from 'formik';

export function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  as,
  children,
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        as={as}
        placeholder={placeholder}
        className="form-control"
      >
        {children}
      </Field>
      <ErrorMessage component="div" className="form-error" name={name} />
    </div>
  );
}
