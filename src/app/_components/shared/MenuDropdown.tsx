import { useEffect, useRef, useState } from "react";

// More ideas: https://www.youtube.com/watch?v=q6HevBxsPUM
export default function MenuDropdown({
  button,
  content,
}: {
  button: React.ReactNode;
  content: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // dismiss menu when user clicks outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen((prev) => !prev)}>{button}</div>

      {isOpen && (
        <>
          <div
            className="absolute right-0 z-[1000] rounded-lg bg-stone-800 p-2"
            onClick={() => setIsOpen(false)}>
            {content}
          </div>
        </>
      )}
    </div>
  );
}
