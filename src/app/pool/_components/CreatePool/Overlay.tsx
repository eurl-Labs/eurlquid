interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Overlay({ isOpen, onClose }: OverlayProps) {
  if (!isOpen) return null;

  console.log('Overlay is open');

  return (
    <div
      className="fixed inset-0 z-[900] bg-black/10"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Overlay clicked - closing menu');
        onClose();
      }}
      aria-hidden="true"
    />
  );
}