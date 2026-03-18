import { QuestionForm } from "@/components/features/QuestionForm";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            IT Learning Navigator
          </h1>
          <p className="text-muted-foreground">ITの疑問を何でも聞いてみよう</p>
        </div>
        <QuestionForm />
      </div>
    </main>
  );
}
