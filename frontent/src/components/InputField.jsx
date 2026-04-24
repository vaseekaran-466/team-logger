import { ErrorMessage, Field } from 'formik';

export function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  as,
  children,
  className = '',
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-slate-900" htmlFor={name}>
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        as={as}
        placeholder={placeholder}
        className={`w-full rounded-2xl border border-[#d7deea] bg-white px-3.5 py-3 outline-none transition-shadow duration-200 focus:border-[#0f5cc0] focus:shadow-[0_0_0_4px_rgba(15,92,192,0.12)] ${className}`.trim()}
      >
        {children}
      </Field>
      <ErrorMessage component="div" className="text-sm text-[#c23b3b]" name={name} />
    </div>
  );
}
