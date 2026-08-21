import { motion } from "framer-motion";
import { X } from "lucide-react";
import StatusTag, { type ChannelStatus } from "./StatusTag";

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  category: string;
  status: ChannelStatus;
}

interface ChannelRowProps {
  channel: Channel;
  selected: boolean;
  onToggle: (id: string) => void;
  index: number;
  onRemove?: (id: string) => void;
  removeLabel?: string;
}

// 원장(ledger)의 한 줄: 밀도 있게, 채널 ID는 데이터니까 모노스페이스로
const ChannelRow = ({ channel, selected, onToggle, index, onRemove, removeLabel }: ChannelRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12, delay: Math.min(index * 0.012, 0.3) }}
      className={`group grid grid-cols-[15px_24px_minmax(0,1fr)_auto] items-center gap-3 h-10 px-4 border-b border-border/70 last:border-b-0 cursor-pointer transition-colors duration-100 ${
        channel.status === "migrated" ? "animate-flash-success" : ""
      } ${selected ? "bg-accent/40 dark:bg-accent/25" : "hover:bg-secondary/60"}`}
      onClick={() => onToggle(channel.id)}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(channel.id)}
        className="ledger-check"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="w-6 h-6 rounded overflow-hidden flex-none border border-border/60">
        {channel.avatar ? (
          <img src={channel.avatar} alt="" loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-content-center bg-secondary text-muted-foreground text-[10px] font-semibold">
            {channel.name.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2.5 min-w-0">
        <span className="text-[13px] font-medium text-foreground truncate">{channel.name}</span>
        <span className="font-mono text-[10px] text-muted-foreground/70 truncate hidden lg:inline">
          {channel.id}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2 w-[104px]">
        <StatusTag status={channel.status} />
        {onRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(channel.id); }}
            className="p-0.5 rounded text-muted-foreground/50 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all duration-100"
            title={removeLabel}
            aria-label={removeLabel}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ChannelRow;
