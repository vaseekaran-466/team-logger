export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const variantClasses = {
    primary:
      'border border-[#1f4ea3] bg-[#1f4ea3] text-white shadow-[0_12px_24px_rgba(31,78,163,0.18)] hover:bg-[#183c7f]',
    secondary:
      'border border-[#d6dfeb] bg-white text-slate-800 hover:bg-[#f7f9fc]',
    danger:
      'border border-[#efc7c3] bg-[#fff1ef] text-[#bf4a44] hover:bg-[#fde8e5]',
  };

  return (
    <button
      className={[
        'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-2xl px-4 py-2.5 font-semibold transition duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70',
        variantClasses[variant] ?? variantClasses.primary,
        className,
      ].join(' ').trim()}
      {...props}
    >
      {children}
    </button>
  );
}
