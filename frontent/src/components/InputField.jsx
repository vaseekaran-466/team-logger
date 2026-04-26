import { ErrorMessage, Field } from 'formik';

export function InputField({label,name,type = 'text',
placeholder,
  as,
  children,
  className = '',
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-800" htmlFor={name}>
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        as={as}
        placeholder={placeholder}
        className={`w-full rounded-2xl border border-[#d6dfeb] bg-white px-3.5 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#1f4ea3] focus:shadow-[0_0_0_4px_rgba(31,78,163,0.08)] ${className}`.trim()}
      >
        {children}
      </Field>
      <ErrorMessage component="div" className="text-sm text-[#b64949]" name={name} />
    </div>
  );
}
