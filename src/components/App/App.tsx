import { useState, type ChangeEvent, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { AxiosError } from 'axios';

import { fetchNotes, type FetchNotesParams } from '../../services/noteService';
import type { FetchNotesResponse } from '../../types/response';

import NoteList from '../NoteList/NoteList.tsx';
import SearchBox from '../SearchBox/SearchBox.tsx';
import Modal from '../Modal/Modal.tsx';
import NoteForm from '../NoteForm/NoteForm.tsx';
import Loader from '../LoadingIndicator/LoadingIndicator.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import Pagination from '../Pagination/Pagination.tsx';

import { Toaster } from 'react-hot-toast';
import css from './App.module.css';

const NOTES_PER_PAGE = 12;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);

  const queryParams: FetchNotesParams = {
    page: currentPage,
    perPage: NOTES_PER_PAGE,
    search: debouncedSearchQuery,
  };

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', queryParams],
    queryFn: () => fetchNotes(queryParams),

    placeholderData: previousData => {
      return previousData;
    },

    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 429) {
        return failureCount < 2;
      }
      return failureCount < 3;
    },
    retryDelay: attempt =>
      Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30000),
  });

  useEffect(() => {
    console.log('APP DEBUG: useQuery data:', data);
    console.log('APP DEBUG: Notes count:', data?.notes.length);
  }, [data]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const filteredNotes = data?.notes;
  const totalPages = data?.totalPages || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && !data) return <Loader />;
  if (isError) return <ErrorMessage />;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      <Toaster />

      {Array.isArray(filteredNotes) && filteredNotes.length > 0 ? (
        <NoteList notes={filteredNotes} />
      ) : (
        <p>No notes found.</p>
      )}

      {openModal && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
