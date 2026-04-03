import Image from "next/image";

export function PhoneMockup() {
  return (
    <div className="mx-auto w-full max-w-[22rem] rounded-[2.2rem] border border-white/10 bg-[#151021] p-3 shadow-[0_24px_90px_rgba(0,0,0,0.3)]">
      <div className="mb-3 flex justify-center">
        <div className="h-1.5 w-20 rounded-full bg-white/10" />
      </div>

      <div className="rounded-[1.65rem] border border-white/6 bg-[linear-gradient(180deg,#231a35,#2c2141)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/6">
              <Image
                src="/resevia/logo.svg"
                alt="Resevia logo"
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Sophia</p>
              <p className="text-xs text-[color:var(--color-text-secondary)]">Resevia AI receptionist</p>
            </div>
          </div>
          <div className="live-dot" />
        </div>

        <div className="space-y-3 text-sm leading-6">
          <div className="mr-8 rounded-2xl rounded-bl-md bg-white/7 px-4 py-3 text-[color:var(--color-text-primary)]">
            Hi, I&apos;d like to book a cut and colour for Saturday.
          </div>

          <div className="ml-8 rounded-2xl rounded-br-md bg-[rgba(154,124,255,0.82)] px-4 py-3 text-white">
            Hi! I have availability at 10:00, 13:30, or 15:00 on Saturday. Which works best for you?
          </div>

          <div className="mr-16 rounded-2xl rounded-bl-md bg-white/7 px-4 py-3 text-[color:var(--color-text-primary)]">
            13:30 please.
          </div>

          <div className="ml-10 rounded-2xl rounded-br-md bg-[rgba(154,124,255,0.82)] px-4 py-3 text-white">
            You&apos;re all booked in for Saturday at 13:30 with Amo Salon. See you then! ✓
          </div>
        </div>
      </div>
    </div>
  );
}
