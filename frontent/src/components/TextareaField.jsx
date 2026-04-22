import { ErrorMessage, Field } from 'formik';

export function TextareaField({
  label,
  name,
  rows = 4,
  placeholder,
}) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="form-control textarea-control"
      />
      <ErrorMessage component="div" className="form-error" name={name} />
    </div>
  );
}
