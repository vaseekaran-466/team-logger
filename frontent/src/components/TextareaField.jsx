import { ErrorMessage, Field } from 'formik';

export function TextareaField({
  label,
  name,
  rows = 4,
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-slate-900" htmlFor={name}>
        {label}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-2xl border border-[#d7deea] bg-white px-3.5 py-3 outline-none transition-shadow duration-200 focus:border-[#0f5cc0] focus:shadow-[0_0_0_4px_rgba(15,92,192,0.12)]"
      />
      <ErrorMessage component="div" className="text-sm text-[#c23b3b]" name={name} />
    </div>
  );
}
