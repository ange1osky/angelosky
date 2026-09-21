import { PlusIcon } from './Icons.jsx'

/* The four registration marks pinned to a box's corners — the same mark the
   intro frame closes in on, reused across every page. The parent must be
   positioned; nudge the marks with --mark-x / --mark-y and colour them with
   --mark-color. */
export default function CornerMarks() {
  return (
    <>
      <PlusIcon className="mark mark--tl" />
      <PlusIcon className="mark mark--tr" />
      <PlusIcon className="mark mark--bl" />
      <PlusIcon className="mark mark--br" />
    </>
  )
}

/* Marks where the two full-height page lines cross the top or bottom edge of
   the parent — the joins between the nav, each band of a page and the footer.
   `split` adds one more where a divided band meets that edge; the parent sets
   its position as --split, next to the columns it follows. */
export function LineMarks({ edge = 'top', split = false }) {
  return (
    <>
      <PlusIcon className={`line-mark line-mark--${edge} line-mark--left`} />
      <PlusIcon className={`line-mark line-mark--${edge} line-mark--right`} />
      {split && <PlusIcon className={`line-mark line-mark--${edge} line-mark--split`} />}
    </>
  )
}
