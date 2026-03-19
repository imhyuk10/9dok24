import { motion } from "framer-motion";
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
}

const ChannelRow = ({ channel, selected, onToggle, index }: ChannelRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
      className={`group flex items-center justify-between py-2.5 px-4 border-b border-border transition-colors duration-150 cursor-pointer ${
        channel.status === "migrated" ? "animate-flash-success" : ""
      } hover:bg-accent/50`}
      onClick={() => onToggle(channel.id)}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(channel.id)}
          className="w-4 h-4 rounded-sm border-border bg-secondary accent-primary cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="w-8 h-8 rounded-md bg-secondary border border-border overflow-hidden flex-shrink-0">
          <img src={channel.avatar} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{channel.name}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">{channel.category}</span>
        </div>
      </div>
      <StatusTag status={channel.status} />
    </motion.div>
  );
};

export default ChannelRow;
