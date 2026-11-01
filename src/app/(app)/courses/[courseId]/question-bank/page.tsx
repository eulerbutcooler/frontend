import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpenCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api-client";
import type { BankQuestion, Course } from "@/types/course";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

const DIFFICULTY_ORDER = ["easy", "medium", "hard"] as const;

export default async function QuestionBankPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "instructor") redirect(`/courses/${courseId}`);

  let course: Course;
  let questions: BankQuestion[] = [];
  try {
    [course, questions] = await Promise.all([
      api.get<Course>(`/api/v1/courses/${courseId}`),
      api.get<BankQuestion[]>(`/api/v1/courses/${courseId}/question-bank`),
    ]);
    questions = Array.isArray(questions) ? questions : [];
  } catch {
    notFound();
  }

  const grouped = DIFFICULTY_ORDER.map((difficulty) => ({
    difficulty,
    questions: questions.filter(
      (question) => (question.difficulty ?? "medium") === difficulty
    ),
  }));

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-[20px] font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to subject
        </Link>
        <div className="text-[12px] text-gray-500">
          {course.title} · {questions.length} questions
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
                Subject Question Bank
              </h1>
              <p className="text-[13px] text-gray-500 mt-1 max-w-2xl">
                Questions generated per topic and tagged by difficulty. Subject
                quizzes sample randomly from this bank by difficulty.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {grouped.map(({ difficulty, questions: items }) => (
              <div
                key={difficulty}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50/50"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {difficulty}
                </p>
                <p className="text-[22px] font-bold text-gray-900 mt-1">
                  {items.length}
                </p>
              </div>
            ))}
          </div>

          {questions.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center text-[13px] text-gray-500">
              The question bank is still generating. Open this page again after
              the subject&apos;s quizzes are ready.
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.map(({ difficulty, questions: items }) =>
                items.length === 0 ? null : (
                  <section key={difficulty}>
                    <h2 className="text-[13px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                      {difficulty} · {items.length}
                    </h2>
                    <div className="space-y-3">
                      {items.map((question, index) => (
                        <article
                          key={question.id}
                          className="border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[13px] font-semibold text-gray-900 leading-relaxed">
                              {index + 1}. {question.question}
                            </p>
                            {question.topic_phrase && (
                              <span className="shrink-0 text-[10px] font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5 max-w-[220px] truncate">
                                {question.topic_phrase}
                              </span>
                            )}
                          </div>

                          {question.choices && question.choices.length > 0 && (
                            <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-1.5">
                              {question.choices.map((choice) => (
                                <li
                                  key={choice.label}
                                  className={`text-[12px] rounded-lg px-2.5 py-1.5 border ${
                                    choice.label === question.answer
                                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                                      : "border-gray-100 bg-gray-50 text-gray-600"
                                  }`}
                                >
                                  <span className="font-semibold">
                                    {choice.label}.
                                  </span>{" "}
                                  {choice.text}
                                </li>
                              ))}
                            </ul>
                          )}

                          {question.type === "open_ended" && (
                            <p className="mt-3 text-[12px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-2">
                              Reference answer: {question.answer}
                            </p>
                          )}

                          {question.explanation && (
                            <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
                              {question.explanation}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
