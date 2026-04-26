import { ErrorMessage, Field } from 'formik';

export function TextareaField({
  label,
  name,
  rows = 4,
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-800" htmlFor={name}>
        {label}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-2xl border border-[#d8dee6] bg-white px-3.5 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#1f2937] focus:shadow-[0_0_0_4px_rgba(31,41,55,0.08)]"
      />
      <ErrorMessage component="div" className="text-sm text-[#b64949]" name={name} />
    </div>
  );
}
