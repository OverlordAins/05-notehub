import css from './NoteItem.module.css';
import type { Note } from '../../types/note';

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
}

const NoteItem = ({ note, onDelete }: NoteItemProps) => {
  return (
    // ✅ NoteItem має бути li
    <li className={css.listItem}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>
      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>
        <button className={css.button} onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default NoteItem;
