export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const variantClasses = {
    primary: 'bg-[#0f5cc0] text-white hover:bg-[#0b478f]',
    secondary: 'bg-[#eef2f6] text-slate-800 hover:bg-[#e3e9f1]',
    danger: 'bg-red-50 text-[#c23b3b] hover:bg-red-100',
  };

  return (
    <button
      className={[
        'cursor-pointer rounded-2xl border-0 px-[18px] py-3 font-bold transition duration-200 ease-in-out hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70',
        variantClasses[variant] ?? variantClasses.primary,
        className,
      ].join(' ').trim()}
      {...props}
    >
      {children}
    </button>
  );
}
