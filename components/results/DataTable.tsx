'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Columns,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  Maximize2,
  Eye,
  ImageIcon,
  ImageOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  isImageUrl,
  isImageField,
  extractImagesFromAttachments,
  extractImageFromUser,
  extractImagesFromMedia,
  hasImageData,
} from '@/lib/utils/image-helpers';

interface DataTableProps {
  data: any[];
}

// Image thumbnail component for table cells
function ImageThumbnail({ src, alt = 'Image' }: { src: string; alt?: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
        <ImageOff className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative w-12 h-12 bg-muted rounded overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        unoptimized // For external CDN images
      />
    </div>
  );
}

// Image gallery component for multiple images
function ImageGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Thumbnail grid */}
      <div className="flex flex-wrap gap-2">
        {images.slice(0, 4).map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedIndex(idx);
              setOpen(true);
            }}
            className="relative group"
          >
            <ImageThumbnail src={img} alt={`Image ${idx + 1}`} />
            {idx === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center text-white text-xs font-medium">
                +{images.length - 4}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Full size dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Image {selectedIndex + 1} of {images.length}
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full" style={{ minHeight: '400px' }}>
            <div className="relative w-full h-[500px]">
              <Image
                src={images[selectedIndex]}
                alt={`Image ${selectedIndex + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : images.length - 1
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedIndex + 1} / {images.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev < images.length - 1 ? prev + 1 : 0
                  )
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple Checkbox component
function Checkbox({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        'flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-md transition-colors',
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

// Row details viewer component
function RowDetailsViewer({ row }: { row: any }) {
  const [open, setOpen] = useState(false);

  const renderValue = (value: any, fieldName: string) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">null</span>;
    }

    if (typeof value === 'boolean') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary">
          {value ? 'Yes' : 'No'}
        </span>
      );
    }

    // Check for user object (Facebook)
    if (typeof value === 'object' && fieldName.toLowerCase() === 'user') {
      const profilePic = extractImageFromUser(value);
      if (profilePic) {
        return (
          <div className="flex flex-col gap-3">
            <div className="relative w-24 h-24 bg-muted rounded-full overflow-hidden">
              <Image
                src={profilePic}
                alt="Profile Picture"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-1">
              {value.name && <p className="text-sm font-medium">{value.name}</p>}
              {value.id && <p className="text-xs text-muted-foreground">ID: {value.id}</p>}
            </div>
            <a
              href={profilePic}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all text-xs"
            >
              {profilePic}
            </a>
          </div>
        );
      }
    }

    // Check for media array (Facebook)
    if (Array.isArray(value) && fieldName.toLowerCase() === 'media') {
      const images = extractImagesFromMedia(value);
      if (images.length > 0) {
        return <ImageGallery images={images} />;
      }
    }

    // Check for attachments field (Facebook)
    if (fieldName.toLowerCase().includes('attachment')) {
      const images = extractImagesFromAttachments(value);
      if (images.length > 0) {
        return <ImageGallery images={images} />;
      }
    }

    // Check if it's an image URL
    if (typeof value === 'string' && isImageUrl(value)) {
      return (
        <div className="flex flex-col gap-2">
          <div className="relative w-48 h-48 bg-muted rounded overflow-hidden">
            <Image
              src={value}
              alt="Image"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all text-xs"
          >
            {value}
          </a>
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-60 whitespace-pre-wrap break-words">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    if (typeof value === 'string' && value.startsWith('http')) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all text-sm"
        >
          {value}
        </a>
      );
    }

    return <span className="text-sm break-words">{String(value)}</span>;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh]" style={{ maxWidth: '50rem' }}>
        <DialogHeader>
          <DialogTitle>Row Details</DialogTitle>
          <DialogDescription>
            Complete information for this record
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] w-full">
          <div className="space-y-4 pr-4">
            {Object.entries(row).map(([key, value]) => (
              <div
                key={key}
                className="grid grid-cols-[200px_1fr] gap-4 pb-4 border-b last:border-0"
              >
                <div className="font-semibold text-sm text-muted-foreground">
                  {key
                    .split(/(?=[A-Z])|_/)
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </div>
                <div className="min-w-0">{renderValue(value, key)}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Cell content viewer - simplified for table display
function CellContentViewer({
  value,
  columnName
}: {
  value: any;
  columnName: string;
}) {
  // Handle different data types
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">-</span>;
  }

  if (typeof value === 'boolean') {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary">
        {value ? 'Yes' : 'No'}
      </span>
    );
  }

  // Check for user object (Facebook)
  if (typeof value === 'object' && columnName.toLowerCase() === 'user') {
    const profilePic = extractImageFromUser(value);
    if (profilePic) {
      return (
        <div className="flex items-center gap-2">
          <ImageThumbnail src={profilePic} alt="Profile" />
          <span className="text-sm truncate max-w-[150px]">
            {value.name || value.id || 'User'}
          </span>
        </div>
      );
    }
  }

  // Check for media array (Facebook)
  if (Array.isArray(value) && columnName.toLowerCase() === 'media') {
    const images = extractImagesFromMedia(value);
    if (images.length > 0) {
      return (
        <div className="flex items-center gap-2">
          <ImageThumbnail src={images[0]} alt="Media" />
          {images.length > 1 && (
            <span className="text-xs text-muted-foreground">
              +{images.length - 1} more
            </span>
          )}
        </div>
      );
    }
  }

  // Check for attachments field (Facebook)
  if (typeof value === 'object' && columnName.toLowerCase().includes('attachment')) {
    const images = extractImagesFromAttachments(value);
    if (images.length > 0) {
      return (
        <div className="flex items-center gap-2">
          <ImageThumbnail src={images[0]} alt="Attachment" />
          {images.length > 1 && (
            <span className="text-xs text-muted-foreground">
              +{images.length - 1} more
            </span>
          )}
        </div>
      );
    }
  }

  if (typeof value === 'object') {
    const jsonStr = JSON.stringify(value);
    return (
      <span className="text-xs text-muted-foreground truncate block max-w-[200px]">
        {jsonStr.substring(0, 30)}...
      </span>
    );
  }

  // Check if it's an image URL
  if (typeof value === 'string' && isImageUrl(value)) {
    return (
      <div className="flex items-center gap-2">
        <ImageThumbnail src={value} />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-xs truncate max-w-[150px]"
          onClick={(e) => e.stopPropagation()}
        >
          View
        </a>
      </div>
    );
  }

  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline text-sm truncate block max-w-[200px]"
        onClick={(e) => e.stopPropagation()}
      >
        {value.length > 40 ? value.substring(0, 40) + '...' : value}
      </a>
    );
  }

  // Handle regular string or other values
  const stringValue = String(value);

  if (stringValue.length > 50) {
    return (
      <span className="text-sm truncate block max-w-[200px]" title={stringValue}>
        {stringValue.substring(0, 50)}...
      </span>
    );
  }

  return (
    <span className="text-sm">{stringValue}</span>
  );
}

export default function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(25);

  // Dynamically generate columns from data
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!data || data.length === 0) return [];

    // Get all unique keys from all data items
    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    // Create Actions column first
    const actionsColumn: ColumnDef<any> = {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return <RowDetailsViewer row={row.original} />;
      },
    };

    // Convert keys to column definitions
    const dataColumns = Array.from(allKeys).map((key) => {
      const columnHeader = key
        .split(/(?=[A-Z])|_/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        accessorKey: key,
        header: columnHeader,
        enableHiding: true,
        cell: ({ getValue }: { getValue: () => any }) => {
          const value = getValue();
          return <CellContentViewer value={value} columnName={columnHeader} />;
        },
      };
    });

    // Return with Actions column first
    return [actionsColumn, ...dataColumns];
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  // Column filter inputs
  const [columnFilterInputs, setColumnFilterInputs] = useState<Record<string, string>>({});

  const handleColumnFilter = (columnId: string, value: string) => {
    setColumnFilterInputs((prev) => ({ ...prev, [columnId]: value }));
    const column = table.getColumn(columnId);
    if (column) {
      column.setFilterValue(value || undefined);
    }
  };

  const clearColumnFilters = () => {
    setColumnFilterInputs({});
    table.resetColumnFilters();
  };

  const hasColumnFilters = Object.keys(columnFilterInputs).some(
    (key) => columnFilterInputs[key]
  );

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium mb-2">No data available</p>
        <p className="text-sm">The scraping session has no results yet.</p>
      </div>
    );
  }

  const exportToJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-1 gap-2 items-center w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Column Filter Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasColumnFilters && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {Object.keys(columnFilterInputs).filter(
                      (key) => columnFilterInputs[key]
                    ).length}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Column Filters</DialogTitle>
                <DialogDescription>
                  Filter data by specific columns
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanFilter())
                  .map((column) => (
                    <div key={column.id} className="space-y-2">
                      <label className="text-sm font-medium">
                        {typeof column.columnDef.header === 'string'
                          ? column.columnDef.header
                          : column.id}
                      </label>
                      <Input
                        placeholder={`Filter ${column.id}...`}
                        value={
                          (columnFilterInputs[column.id] as string) || ''
                        }
                        onChange={(e) =>
                          handleColumnFilter(column.id, e.target.value)
                        }
                      />
                    </div>
                  ))}
                {hasColumnFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearColumnFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Column Visibility Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Toggle Columns</DialogTitle>
                <DialogDescription>
                  Show or hide columns in the table
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4 max-h-[60vh] overflow-y-auto">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const header =
                      typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id;
                    return (
                      <Checkbox
                        key={column.id}
                        checked={column.getIsVisible()}
                        onChange={(checked) =>
                          column.toggleVisibility(checked)
                        }
                        label={header}
                      />
                    );
                  })}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Export and Page Size */}
        <div className="flex gap-2 items-center">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              const newPageSize = parseInt(value);
              setPageSize(newPageSize);
              table.setPageSize(newPageSize);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={exportToJSON}>
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {table.getFilteredRowModel().rows.length} of {data.length}{' '}
        results
        {hasColumnFilters && ' (filtered)'}
      </div>

      {/* Table - Mobile responsive wrapper */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'whitespace-nowrap',
                        !header.column.getIsVisible() && 'hidden'
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => header.column.toggleSorting()}
                            className="h-8 -ml-2 data-[state=open]:bg-accent"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === 'asc' && (
                              <ArrowUp className="ml-2 h-4 w-4" />
                            )}
                            {header.column.getIsSorted() === 'desc' && (
                              <ArrowDown className="ml-2 h-4 w-4" />
                            )}
                            {!header.column.getIsSorted() && (
                              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                            )}
                          </Button>
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          !cell.column.getIsVisible() && 'hidden'
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground">No results found</p>
                      {(hasColumnFilters || globalFilter) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGlobalFilter('');
                            clearColumnFilters();
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()} ({table.getRowModel().rows.length} rows)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
