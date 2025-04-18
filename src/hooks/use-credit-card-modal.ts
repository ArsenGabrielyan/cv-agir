import { CreditCardType } from "@/data/types/schema"
import {create} from "zustand"

interface CreditCardModalState{
     open: boolean
     setOpen: (open: boolean) => void,
     cardToEdit: CreditCardType | null,
     setCreditCard: (cardToEdit: CreditCardType | null) => void,
     index: number,
     setIndex: (index: number) => void
}

const useCreditCardModal = create<CreditCardModalState>(set=>({
     open: false,
     setOpen: (open) => set({open}),
     cardToEdit: null,
     setCreditCard: (cardToEdit) => set(({cardToEdit})),
     index: -1,
     setIndex: (index) => set({index})
}))

export default useCreditCardModal