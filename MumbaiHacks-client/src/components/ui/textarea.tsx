import * as React from "react"
import { cn } from "@/lib/utils"

interface TextareaProps {
  className?: string;
  inputValue: string;
  setInputValue: (value: string) => void;
}

const Textarea: React.FC<TextareaProps> = ({ className, inputValue, setInputValue }) => {
  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  return (
    <input
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      type="text"
      placeholder=""
      value={inputValue}
      onChange={handleInputChange}
    />
  );
};

Textarea.displayName = "Textarea";

export { Textarea };
