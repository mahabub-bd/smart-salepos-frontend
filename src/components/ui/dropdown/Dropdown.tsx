import type React from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Find the trigger element (the element that opened this dropdown)
    if (isOpen && dropdownRef.current) {
      const dropdownElement = dropdownRef.current;
      const parent = dropdownElement.parentElement;
      if (parent) {
        // Look for the trigger button in the parent
        const trigger = parent.querySelector('button, [role="button"]');
        if (trigger) {
          triggerRef.current = trigger as HTMLElement;

          // Position the dropdown relative to the trigger
          const rect = trigger.getBoundingClientRect();

          // Set position
          dropdownElement.style.position = 'fixed';
          dropdownElement.style.top = `${rect.bottom + window.scrollY + 8}px`;
          dropdownElement.style.right = `${window.innerWidth - rect.right}px`;
          dropdownElement.style.zIndex = '9999';
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  // Use portal to render the dropdown at the body level
  return createPortal(
    <div
      ref={dropdownRef}
      className={`rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
    >
      {children}
    </div>,
    document.body
  );
};
