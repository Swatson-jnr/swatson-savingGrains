import { Button } from "@/components/ui/button";

interface ClearFiltersButtonProps {
  onClear: () => void;
  className?: string;
}

export const ClearFiltersButton = ({
  onClear,
  className = "",
}: ClearFiltersButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClear}
      className={`text-sm font-medium ${className}`}
    >
      Clear Filters
    </Button>
  );
};
