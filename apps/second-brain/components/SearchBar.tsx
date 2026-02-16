import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-3 top-3 text-jade-light opacity-70"
      />
      <input
        type="text"
        placeholder="Search documents, concepts, notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 bg-jade-light text-jade-purple placeholder-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-cream"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-3 text-jade-light hover:text-jade-purple transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
