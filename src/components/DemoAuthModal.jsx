import { useNavigate } from "react-router-dom";
import { MagicCard } from "./magicui/magic-card";
import { ShimmerButton } from "./magicui/shimmer-button";
import { BlurFade } from "./magicui/blur-fade";
import { BorderBeam } from "./magicui/border-beam";
import { SparklesText } from "./magicui/sparkles-text";

export default function DemoAuthModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-surface-elevated border border-[#2a2a42] rounded-2xl p-8 max-w-sm w-full text-center shadow-modal overflow-hidden">
        <BorderBeam size={250} duration={10} colorFrom="#22c55e" colorTo="#6366f1" />

        <MagicCard
          gradientColor="#22c55e18"
          className="rounded-2xl"
        >
          <div className="relative z-10 p-2">

            <BlurFade delay={0.05}>
              <div className="text-5xl mb-4">🔒</div>
            </BlurFade>

            <BlurFade delay={0.1}>
              <SparklesText className="text-xl font-bold tracking-tight text-white mb-2">
                Create an account
              </SparklesText>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                to continue
              </p>
            </BlurFade>

            <BlurFade delay={0.15}>
              <p className="text-gray-400 text-sm mt-3 mb-6">
                You're exploring the demo. Sign up to create your own tasks and
                start tracking your real habits.
              </p>
            </BlurFade>

            <BlurFade delay={0.2}>
              <div className="flex flex-col gap-3">
                <ShimmerButton
                  onClick={() => navigate("/register")}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm"
                >
                  Sign up — it's free
                </ShimmerButton>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-surface-card border border-surface-border hover:bg-surface-hover py-2.5 rounded-lg font-semibold text-sm text-gray-200 hover:text-white transition-all"
                >
                  Sign in
                </button>

                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-200 text-sm mt-1 transition-colors"
                >
                  Continue exploring demo
                </button>
              </div>
            </BlurFade>
          </div>
        </MagicCard>
      </div>
    </div>
  );
}
