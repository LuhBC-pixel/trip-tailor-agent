
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface BudgetSliderProps {
  budget: number[];
  setBudget: React.Dispatch<React.SetStateAction<number[]>>;
}

const BudgetSlider = ({ budget, setBudget }: BudgetSliderProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label>Orçamento máximo</Label>
        <span className="text-md font-medium">R$ {budget[0].toLocaleString()}</span>
      </div>
      <div className="px-2">
        <Slider
          defaultValue={[5000]}
          max={20000}
          min={500}
          step={100}
          value={budget}
          onValueChange={setBudget}
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>R$ 500</span>
          <span>R$ 20.000</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSlider;
