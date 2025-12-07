'use client';


export function ScreenLoader() {
  return (
    <div className="flex flex-col items-center gap-2 justify-center fixed inset-0 z-50 transition-opacity duration-700 ease-in-out">
      <img
        src={'/media/storely-logos/logo-icon-light.svg'}
        className="h-[35px] max-w-none dark:hidden"
        alt=""
      />
      <img
        src={'/media/storely-logos/logo-icon-dark.svg'}
        className="h-[35px] max-w-none dark:block hidden"
        alt=""
      />
      <div className="text-muted-foreground font-medium text-sm">
        Loading...
      </div>
    </div>
  );
}
