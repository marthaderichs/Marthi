import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SubjectId } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (id: SubjectId) => {
  const map: Record<SubjectId, string> = {
    cardio: 'var(--color-cardio)',
    pneumo: 'var(--color-pneumo)',
    gastro: 'var(--color-gastro)',
    neuro: 'var(--color-neuro)',
    endo: 'var(--color-endo)',
    nephro: 'var(--color-nephro)',
    hemato_onko: 'var(--color-hemato_onko)',
    rheuma: 'var(--color-rheuma)',
    gyn: 'var(--color-gyn)',
    paedia: 'var(--color-paedia)',
    anaesthesie: 'var(--color-anaesthesie)',
    arbeitsmed: 'var(--color-arbeitsmed)',
    augen: 'var(--color-augen)',
    chirurgie: 'var(--color-chirurgie)',
    derma: 'var(--color-derma)',
    allergo: 'var(--color-allergo)',
    hno: 'var(--color-hno)',
    immuno: 'var(--color-immuno)',
    infektio: 'var(--color-infektio)',
    intensiv: 'var(--color-intensiv)',
    patho: 'var(--color-patho)',
    pharma: 'var(--color-pharma)',
    psych: 'var(--color-psych)',
    radio: 'var(--color-radio)',
    reha: 'var(--color-reha)',
    sozial: 'var(--color-sozial)',
    uro: 'var(--color-uro)',
  };
  return map[id] || '#999';
};

export const getSubjectTailwindColor = (id: SubjectId) => {
    // Fallback classes for where we can't use style objects easily
    // Note: In the new design we prefer inline styles with the CSS variables for exact color matching
    const map: Record<SubjectId, string> = {
      cardio: 'text-[var(--color-cardio)]',
      pneumo: 'text-[var(--color-pneumo)]',
      gastro: 'text-[var(--color-gastro)]',
      neuro: 'text-[var(--color-neuro)]',
      endo: 'text-[var(--color-endo)]',
      nephro: 'text-[var(--color-nephro)]',
      hemato_onko: 'text-[var(--color-hemato_onko)]',
      rheuma: 'text-[var(--color-rheuma)]',
      gyn: 'text-[var(--color-gyn)]',
      paedia: 'text-[var(--color-paedia)]',
      anaesthesie: 'text-[var(--color-anaesthesie)]',
      arbeitsmed: 'text-[var(--color-arbeitsmed)]',
      augen: 'text-[var(--color-augen)]',
      chirurgie: 'text-[var(--color-chirurgie)]',
      derma: 'text-[var(--color-derma)]',
      allergo: 'text-[var(--color-allergo)]',
      hno: 'text-[var(--color-hno)]',
      immuno: 'text-[var(--color-immuno)]',
      infektio: 'text-[var(--color-infektio)]',
      intensiv: 'text-[var(--color-intensiv)]',
      patho: 'text-[var(--color-patho)]',
      pharma: 'text-[var(--color-pharma)]',
      psych: 'text-[var(--color-psych)]',
      radio: 'text-[var(--color-radio)]',
      reha: 'text-[var(--color-reha)]',
      sozial: 'text-[var(--color-sozial)]',
      uro: 'text-[var(--color-uro)]',
    };
    return map[id] || 'text-gray-500';
};
