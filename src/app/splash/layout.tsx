export default function SplashLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#1C1C1E', height: '100dvh' }}>
      {children}
    </div>
  );
}
