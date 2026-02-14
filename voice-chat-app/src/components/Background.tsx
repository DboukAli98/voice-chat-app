import { memo } from "react";

export const Background = memo(function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-void via-abyss to-deep" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Floating orbs */}
      <div
        className="orb w-[500px] h-[500px] -top-[100px] -left-[100px]"
        style={{ background: "radial-gradient(circle, #4d7cff 0%, transparent 70%)" }}
      />
      <div
        className="orb w-[400px] h-[400px] top-[60%] -right-[80px]"
        style={{
          background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          animationDelay: "-7s",
        }}
      />
      <div
        className="orb w-[300px] h-[300px] bottom-[10%] left-[30%]"
        style={{
          background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)",
          animationDelay: "-13s",
          opacity: 0.15,
        }}
      />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-transparent to-void/60" />
    </div>
  );
});
