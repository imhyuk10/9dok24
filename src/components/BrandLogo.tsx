interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function BrandLogo({ className = "", size = 24, showText = true }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/9dok24_icon.png"
        alt=""
        width={size}
        height={size}
        className="flex-none"
      />

      {showText && (
        <span className="font-mono text-[13px] font-bold tracking-tight text-foreground leading-none">
          9DOK<span className="text-primary">24</span>
        </span>
      )}
    </div>
  );
}
