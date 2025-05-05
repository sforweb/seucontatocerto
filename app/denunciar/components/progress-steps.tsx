import { cn } from "@/lib/utils"

interface ProgressStepsProps {
  currentStep: number
  steps: { id: number; label: string }[]
}

export function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Linha de conexão de fundo (cinza) */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200"></div>

        {/* Linha de progresso (azul) */}
        <div
          className="absolute top-6 left-0 h-0.5 bg-primary transition-all duration-300"
          style={{
            width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {/* Passos */}
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center z-10">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium mb-2 transition-colors",
                currentStep >= step.id ? "bg-primary text-white" : "bg-gray-200 text-gray-500",
              )}
            >
              {step.id}
            </div>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
