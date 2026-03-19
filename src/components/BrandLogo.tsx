import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function BrandLogo({ className = "", size = 32, showText = true }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-primary/20 bg-primary"
        style={{ width: size, height: size }}
      >
        <img 
          src="/9dok24_icon.png" 
          alt="9dok24 Logo" 
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tighter text-foreground uppercase">
            9dok<span className="text-primary">24</span>
          </span>
          <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase opacity-70">
            구독이사
          </span>
        </div>
      )}
    </div>
  );
}

