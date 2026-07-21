import { useState, useEffect } from 'react';
import { Search, Star, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/Modal';
import { MOCK_REVIEWS } from '../data/mock';
import toast from 'react-hot-toast';

export default function Reviews() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const filteredData = MOCK_REVIEWS.filter((r) => {
    const matchSearch = r.reviewer.toLowerCase().includes(search.toLowerCase()) || r.recipient.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleDelete = () => {
    toast.success('Review deleted successfully.');
    setDeleteModal({ isOpen: false, id: null });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Reviews</h1>
          <p className="text-slate-500 mt-1">Monitor feedback and reviews left by students.</p>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search reviews..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
        
        <div className="bg-white">
          {loading ? (
            <div className="p-6"><TableSkeleton rows={5} /></div>
          ) : filteredData.length === 0 ? (
            <EmptyState 
              icon={Star} 
              title="No reviews found" 
              description="There are no reviews matching your search."
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-slate-900">{r.reviewer}</TableCell>
                      <TableCell className="font-medium text-slate-900">{r.recipient}</TableCell>
                      <TableCell>{renderStars(r.rating)}</TableCell>
                      <TableCell className="text-slate-600 max-w-xs truncate">{r.comment}</TableCell>
                      <TableCell className="text-slate-600">{new Date(r.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2" onClick={() => setDeleteModal({ isOpen: true, id: r.id })}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t border-slate-100 bg-white">
                <Pagination currentPage={page} totalPages={Math.ceil(filteredData.length / 10)} onPageChange={setPage} />
              </div>
            </>
          )}
        </div>
      </Card>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? It will be permanently removed from the recipient's profile."
        variant="danger"
        confirmText="Delete Review"
      />
    </div>
  );
}
