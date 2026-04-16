
import Logo from '@/app/components/Logo'

type AuthShellProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#3a2a23]">
        <header className="flex justify-end px-8 py-6">
         <Logo />
        </header>

      <main className="flex min-h-[calc(100vh-88px)] items-center justify-center px-6 pb-10">
        <div className="w-full max-w-[520px] rounded-[28px] border border-[#e6ddd6] bg-white p-8 shadow-sm md:p-10">
          <h2 className="text-[34px] font-semibold leading-tight text-[#3a2a23]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-3 text-[15px] leading-7 text-[#8d8179]">
              {subtitle}
            </p>
          )}

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}