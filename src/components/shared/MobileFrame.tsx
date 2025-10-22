import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] h-[844px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 relative">
        {/* Status Bar */}
        <div className="h-11 bg-white flex items-center justify-between px-8 border-b">
          <span className="text-sm">9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-3 border border-current rounded-sm" />
            <div className="w-1 h-3 bg-current rounded-sm" />
          </div>
        </div>

        {/* App Content */}
        <div className="h-[calc(100%-2.75rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
