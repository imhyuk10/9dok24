import { motion } from "framer-motion";
import { User, CheckCircle2, Circle, Loader2 } from "lucide-react";

interface AccountCardProps {
  label: string;
  email?: string;
  avatar?: string;
  subscriptionCount?: number;
  connected: boolean;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  onConnect: () => void;
}

const AccountCard = ({
  label, email, avatar, subscriptionCount,
  connected, loading, loadingText, disabled, onConnect,
}: AccountCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      className="flex-1 bg-card border border-border rounded-lg p-4 shadow-card"
    >
      <div className="flex items-center gap-2 mb-3">
        {connected ? (
          <CheckCircle2 className="w-4 h-4 text-success" />
        ) : (
          <Circle className="w-4 h-4 text-muted-foreground" />
        )}
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{label}</p>
      </div>

      {connected ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{email}</p>
            {subscriptionCount !== undefined && (
              <p className="text-xs text-muted-foreground font-mono tabular-nums">
                {subscriptionCount}개 구독 중
              </p>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center gap-2 py-2">
          <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
          <p className="text-sm text-muted-foreground">{loadingText ?? "로딩 중..."}</p>
        </div>
      ) : (
        <button
          onClick={onConnect}
          disabled={disabled}
          className="w-full py-2.5 px-4 rounded-md border border-border bg-secondary hover:bg-muted text-sm font-medium text-foreground transition-colors duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Google 계정으로 연결
        </button>
      )}
    </motion.div>
  );
};

export default AccountCard;
