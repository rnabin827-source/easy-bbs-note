import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, GraduationCap, Loader2, StickyNote } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Note } from "./backend";
import { useAddNote, useGetNotes } from "./hooks/useQueries";

const BBS_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;
type BBSYear = (typeof BBS_YEARS)[number];

/** The backend Year enum is typed as y1/y2/y3 but at runtime the Motoko
 * backend passes the plain string value ("1st Year", etc.). Cast safely. */
function getYearLabel(year: unknown): string {
  return typeof year === "string" ? year : "Unknown Year";
}

function NoteCard({ note, index }: { note: Note; index: number }) {
  const yearLabel = getYearLabel(note.year);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="bg-card rounded-lg shadow-card border border-border p-5 flex flex-col gap-3"
      data-ocid={`notes.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <StickyNote className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2">
            {note.title}
          </h3>
        </div>
        <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-accent text-white">
          {yearLabel}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
          {note.subject}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {note.content}
        </p>
      </div>
    </motion.article>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-20 gap-4"
      data-ocid="notes.empty_state"
    >
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
        <BookOpen className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-foreground font-semibold text-base">
          {filtered ? "No notes for this year" : "No notes yet"}
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          {filtered
            ? "Try selecting a different year filter."
            : "Add your first BBS note using the form above."}
        </p>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [filterYear, setFilterYear] = useState<string>("All Years");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState<BBSYear | "">("");
  const [content, setContent] = useState("");

  const activeFilter = filterYear === "All Years" ? null : filterYear;
  const { data: notes = [], isLoading } = useGetNotes(activeFilter);
  const addNote = useAddNote();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !year || !content.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await addNote.mutateAsync({
        title: title.trim(),
        subject: subject.trim(),
        year,
        content: content.trim(),
      });
      setTitle("");
      setSubject("");
      setYear("");
      setContent("");
      toast.success("Note added successfully!");
    } catch {
      toast.error("Failed to add note. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />

      {/* Navbar */}
      <header className="bg-nav sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-accent flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Easy BBS Note
            </span>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <section className="bg-form-bg py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-xl shadow-form p-6 sm:p-8">
              <h2 className="text-lg font-bold text-foreground mb-6">
                Create a New BBS Note
              </h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="title"
                      className="text-xs font-bold text-foreground uppercase tracking-wide"
                    >
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Note title"
                      className="text-sm"
                      data-ocid="note.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="subject"
                      className="text-xs font-bold text-foreground uppercase tracking-wide"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Accounting"
                      className="text-sm"
                      data-ocid="note.subject.input"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="year-select"
                      className="text-xs font-bold text-foreground uppercase tracking-wide"
                    >
                      BBS Year
                    </Label>
                    <Select
                      value={year}
                      onValueChange={(v) => setYear(v as BBSYear)}
                    >
                      <SelectTrigger
                        id="year-select"
                        className="text-sm"
                        data-ocid="note.year.select"
                      >
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {BBS_YEARS.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-5">
                  <Label
                    htmlFor="content"
                    className="text-xs font-bold text-foreground uppercase tracking-wide"
                  >
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note content here..."
                    rows={4}
                    className="text-sm resize-none"
                    data-ocid="note.textarea"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={addNote.isPending}
                  className="w-full bg-green-accent hover:bg-green-hover text-white font-semibold text-sm h-10 rounded-lg transition-colors"
                  data-ocid="note.submit_button"
                >
                  {addNote.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Note...
                    </>
                  ) : (
                    "Add Note"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Notes Section */}
      <main className="flex-1 bg-notes-bg py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Filter Row */}
          <div className="flex items-center gap-3 mb-6">
            <Label
              htmlFor="filter-select"
              className="text-sm font-semibold text-foreground whitespace-nowrap"
            >
              Filter by Year
            </Label>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger
                id="filter-select"
                className="w-44 text-sm bg-card"
                data-ocid="notes.filter.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Years">All Years</SelectItem>
                {BBS_YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes Grid */}
          {isLoading ? (
            <div
              className="flex items-center justify-center py-20 gap-3 text-muted-foreground"
              data-ocid="notes.loading_state"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Loading notes...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {notes.length === 0 ? (
                  <EmptyState filtered={filterYear !== "All Years"} />
                ) : (
                  notes.map((note: Note, i: number) => (
                    <NoteCard key={note.id.toString()} note={note} index={i} />
                  ))
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-nav py-4 text-center">
        <p className="text-xs text-white/60">
          &copy; {new Date().getFullYear()}. Built with{" "}
          <span className="text-red-400">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white/80 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
