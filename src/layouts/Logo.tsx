import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex gap-2 items-center">
      <Image
        src="/images/logo.png"
        alt="logo"
        width={40}
        height={40}
        className="w-[30px] h-[30px]"
      />
      <div className="font-title text-primary inline-flex text-lg transition-all duration-200 md:text-3xl">
        <span>St. Michael Parish</span>
      </div>
    </div>
  );
}
