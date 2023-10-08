import Modals from "@/components/Modals"
import { useRef, useState, useEffect } from "react"
import { FaRegTrashAlt } from "react-icons/fa"
import { currencyFormatter } from "@/lib/utils"
import { db } from "@/lib/firebase/config"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"

function Incomemodal({ open, close, income, setincome }) {
    const amountRef = useRef()
    const descRef = useRef()

    const addincome = async (e) => {
        e.preventDefault();
        const newincome = {
            amount: +amountRef.current.value,
            description: descRef.current.value,
            createdAt: new Date(),
        }
        const collectionRef = collection(db, 'income')
        try {
            const docSnap = await addDoc(collectionRef, newincome)

            setincome(prevState => {
                return [
                    ...prevState,
                    {
                        id: docSnap.id,
                        ...newincome,
                    },
                ]
            })
            amountRef.current.value = ""
            descRef.current.value = ""
        } catch (error) {
            console.log(error.message)
        }
    }

    const deleteincome = async (id) => {
        const docRef = doc(db, "income", id)
        try {
            await deleteDoc(docRef)
            setincome(prevState => {
                return prevState.filter((i) => i.id !== id)
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <Modals open={open} close={close}>
            <form onSubmit={addincome} className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <label htmlFor="amount">Income amount</label>
                    <input type="number" name="amount" ref={amountRef} min={0.01} step={0.01} placeholder="Enter the income amount" required className="px-4 py-2 rounded-xl bg-slate-600" />
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" ref={descRef} placeholder="Enter income description" required className="px-4 py-2 rounded-xl bg-slate-600" />
                </div>
                <button type="submit" className="self-start bg-lime-700 rounded-lg p-2">
                    Add income
                </button>
            </form>
            <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-2xl font-bold">Income history</h3>
                {income.map(i => {
                    return (
                        <div className="flex items-center justify-between" key={i.id}>
                            <div>
                                <p className="font-semibold">
                                    {i.description}
                                </p>
                                <small className="text-xs">
                                    {i.createdAt.toISOString()}
                                </small>
                            </div>
                            <p className="flex items-center gap-2">
                                {currencyFormatter(i.amount)}
                                <button onClick={() => deleteincome(i.id)}>
                                    <FaRegTrashAlt></FaRegTrashAlt>
                                </button>
                            </p>
                        </div>
                    )
                })}
            </div>
        </Modals>
    )
}

export default Incomemodal