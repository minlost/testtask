/**
 * Zde vytvořte formulářové vstupy pomocí react-hook-form, které:
 * 1) Budou součástí formuláře v MainForm, ale zůstanou v odděleném souboru
 * 2) Reference formuláře NEbude získána skrze Prop input (vyvarovat se "Prop drilling")
 * 3) Získá volby (options) pro pole "kategorie" z externího API: https://dummyjson.com/products/categories jako "value" bude "slug", jako "label" bude "name".
 *
 *
 * V tomto souboru budou definovány pole:
 * allocation - number; Bude disabled pokud není amount (z MainForm) vyplněno. Validace na min=0, max=[zadaná hodnota v amount]
 * category - string; Select input s volbami z API (label=name; value=slug)
 * witnesses - FieldArray - dynamické pole kdy lze tlačítkem přidat a odebrat dalšího svědka; Validace minimálně 1 svědek, max 5 svědků
 * witnesses.name - string; Validace required
 * witnesses.email - string; Validace e-mail a asynchronní validace, že email neexistuje na API https://dummyjson.com/users/search?q=[ZADANÝ EMAIL]  - tato validace by měla mít debounce 500ms
 */

import React, { useEffect, useState } from 'react';

import { z } from 'zod';
import { initialValues } from './MainForm';
import { UseFormReturn } from 'react-hook-form';


interface ApiDataInterface {
    name: string;
    slug: string;
}

interface NestedInputsInterface {
    form: UseFormReturn<{
    amount: number;
    damagedParts: string[];
    witnesses: {
        name: string;
        email: string;
    }[];
}, any, undefined>

}
    const amount = initialValues.amount;


  export   const additionScheme = z.object({
        allocation: z.number().min(0, "error").max(amount, `Allocation cannot exceed ${amount}`),
        category: z.string().min(1, ' required'),
        witnesses: z.array(
            z.object({
                name: z.string().min(1, 'error'),
                email: z.string().email('email musi byt vlaidni'),
                }, '')
        ).min(1, 'nejmene 1').max(5, 'nejvice 2'),
        
    });

   

export const NestedInputs = () =>{

    const  [data, setData] = useState<ApiDataInterface[] >([]);
    const [ witnesses, setWitnesses] = useState<{ name: string; email: string }[]>([]);




     const getApiData =  async () => {
        const response = await fetch('https://dummyjson.com/products/categories');
        setData(await response.json());

     }

     useEffect(() => {
        getApiData();
        }, []);

   return (

       <div>
           <div className="">
            <label>
                <input type="number" disabled={!amount} />
            </label>
           </div>
           <div className="">
            <select >
                <option value="">Select category</option>
                {data.map((category ) => (
                    <option key={category.slug} value={category.slug}>
                        {category.name}
                    </option>
                ))}
            </select>
            </div>
              <div className="">
            <label>Witnesses</label>
            <input type='text' id='witness-name' />
            <input type='email' id='witness-email' />
            <button onClick={()=>{
                setWitnesses([...witnesses, { name: '', email: '' }]);
            }}>Add Witness</button>
            </div>
            {witnesses.map((witness, index) => (
                <div key={index}>
                    <ul>
                        <li>{witness.email}</li>
                        <li>{witness.email}</li>
                    </ul>
                    <button onClick={() => {
                        const newWitnesses = witnesses.filter((_, i) => i !== index);
                        setWitnesses(newWitnesses);
                    }}>Remove</button>
                </div>
            ))}
              <div>

            
            </div>
       </div>


   );
};
