import { useState } from 'react';
import { Search, Star, Trash2, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { ConfirmationModal, Modal } from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { useReviews } from '../hooks/useReviews';
import type { ReviewListItem } from '../types/api';

export default function Reviews() {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 0>(0);
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<ReviewListItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const { data, isLoading, error, refetch } = useReviews({});

  const reviewsList: ReviewListItem[] = data?.data || [];

  const filteredData = reviewsList.filter((r) => {
    const matchSearch =
      `${r.reviewer.firstName} ${r.reviewer.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === 0 || r.rating === ratingFilter;
    return matchSearch && matchRating;
  });

  const totalPages = data?.pagination?.totalPages || 1;

  const handleDelete = () => {
    toast.success('Review deleted successfully.');
    setDeleteModal({ isOpen: false, id: null });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Feedback & Reviews</h1>
          <p className="text-slate-500 mt-1">Monitor ratings, review quality, and resolve flagged feedback.</p>
        </div>
      </div>

      {error ? (
        <Card className="p-12">
          <EmptyState
            icon={Star}
            title="Unable to load reviews"
            description={error instanceof Error ? error.message : 'Unable to load reviews. Please try again.'}
            actionText="Retry"
            onAction={() => refetch()}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search reviewer or comments..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Filter Rating:</span>
              <select
                className="h-9 px-3 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-700 outline-none"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
              >
                <option value={0}>All Ratings</option>
                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                <option value={3}>3 Stars ⭐⭐⭐</option>
                <option value={2}>2 Stars ⭐⭐</option>
                <option value={1}>1 Star ⭐</option>
              </select>
            </div>
          </div>

          <div className="bg-white">
            {isLoading ? (
              <div className="p-6"><TableSkeleton rows={5} /></div>
            ) : filteredData.length === 0 ? (
              <EmptyState
                icon={Star}
                title="No reviews found"
                description="There are no student reviews matching your criteria."
              />
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium text-slate-900">
                          {r.reviewer?.firstName} {r.reviewer?.lastName}
                        </TableCell>
                        <TableCell>{renderStars(r.rating)}</TableCell>
                        <TableCell className="text-slate-600 max-w-sm truncate">{r.comment}</TableCell>
                        <TableCell className="text-slate-600 text-xs">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedReview(r)}>
                              <Eye className="w-4 h-4 text-blue-600 mr-1" /> View
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteModal({ isOpen: true, id: r.id })}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="border-t border-slate-100 bg-white p-4">
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Review Details Modal */}
      <Modal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="Review Details"
        footer={<Button variant="outline" onClick={() => setSelectedReview(null)}>Close</Button>}
      >
        {selectedReview && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">{selectedReview.reviewer?.firstName} {selectedReview.reviewer?.lastName}</span>
              {renderStars(selectedReview.rating)}
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700 font-medium">
              "{selectedReview.comment}"
            </div>
            <p className="text-xs text-slate-400">Submitted on: {new Date(selectedReview.createdAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? It will be permanently removed."
        variant="danger"
        confirmText="Delete Review"
      />
    </div>
  );
}
