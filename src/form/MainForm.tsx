import {z } from 'zod';
import { useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NestedInputs } from './NestedFields';


/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován zod schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

// příklad očekávaného výstupního JSON, předvyplňte tímto objektem formulář
export const initialValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ['side', 'rear'],
  category: 'kitchen-accessories',
  witnesses: [
    {
      name: 'Marek',
      email: 'marek@email.cz',
    },
    {
      name: 'Emily',
      email: 'emily.johnson@x.dummyjson.com',
    },
  ],
};

const damagedPartsOptions = ['roof', 'front', 'side', 'rear'];


const scheme = z.object({
  amount: z.number().min(1, 'Musi byt alespoin jeden'),
  damagedParts: z.array(z.enum(damagedPartsOptions), {
    message: 'At least one damaged part must be selected',
  }).min(1, 'At least one damaged part must be selected'),
  witnesses: z.array(
    z.object({
      name: z.string().min(1, 'Jmeno je povinne'),
      email: z.string().email('Meail musi byt validni'),
    })
  ),
  
});

type FormData = z.infer<typeof scheme>;

 const demagedPartsCheckboxes = damagedPartsOptions.map((part) => ({
  label: part.charAt(0).toUpperCase() + part.slice(1),
  value: part,
}));

export const MainForm = () => { 


  const form =  useForm<FormData>({
    resolver: zodResolver(scheme),
    defaultValues: {
      amount: initialValues.amount,
      damagedParts: initialValues.damagedParts,
      witnesses: initialValues.witnesses,
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form>
      <div>
        <label>
          Amount:
          <input
            type="number"
            {...register('amount')}
            className={errors.amount ? 'error' : ''}
          />
        </label>
        {errors.amount && <span className="error-message">{errors.amount.message}</span>}
      </div>

      <div>
        {demagedPartsCheckboxes.map((checkbox) => (
          <div key={checkbox.value}>
            <label>
              <input
                type="checkbox"
                value={checkbox.value}
                {...register('damagedParts')}
                className={errors.damagedParts ? 'error' : ''}
              />
              {checkbox.label}
            </label>
          </div>
        ))}
      </div>
      {errors.damagedParts && <span className="error-message">{errors.damagedParts.message}</span>}

      <div>
        <button type="submit" onClick={handleSubmit(onSubmit)}>
          Submit
        </button>
      </div>
            {/* <NestedInputs form={form}/> */}

    </form>
  );
}



