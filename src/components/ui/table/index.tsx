import { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode;
  className?: string;
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean; // Renders <th> if true, <td> otherwise
  rowSpan?: number; // Support for row spanning
  colSpan?: number; // Support for column spanning
  className?: string; // Tailwind / custom styling
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full ${className || ""}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component (with rowSpan & colSpan support)
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  rowSpan,
  colSpan,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";

  return (
    <CellTag rowSpan={rowSpan} colSpan={colSpan} className={className}>
      {children}
    </CellTag>
  );
};

export { Table, TableBody, TableCell, TableHeader, TableRow };
