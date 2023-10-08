"use client"

import { useState, useEffect, useContext } from "react"
import Items from "@/components/Items"
import { currencyFormatter } from "@/lib/utils"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from "react-chartjs-2"
import Incomemodal from "@/components/modals/Incomemodal"
import Expensemodal from "@/components/modals/Expensemodal"
import SignIn from "@/components/SignIn"
import { authContext } from "@/lib/store/auth-context"
import { db } from "@/lib/firebase/config"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"


ChartJS.register(ArcElement, Tooltip, Legend)

export default function Home() {
  const [modalforincome, setmodalforincome] = useState(false)
  const [modalforexpense, setmodalforexpense] = useState(false)
  const [income, setincome] = useState([])
  const [getex, setex] = useState([])
  const [balance, setbalance] = useState(0)

  const { user } = useContext(authContext)


  useEffect(() => {
    const fetchincome = async () => {
      const collectionRef = collection(db, 'income')
      const docSnap = await getDocs(collectionRef)
      const data = docSnap.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        }
      })
      setincome(data)
    }
    const getexpense = async () => {
      const collectionRef = collection(db, 'expenses')
      const docSnap = await getDocs(collectionRef)
      const data = docSnap.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      })
      setex(data)
    }
    fetchincome();
    getexpense();
  }, [])

  useEffect(() => {
    const newbalance =
      income.reduce((total, i) => {
        return total + i.amount
      }, 0) -
      getex.reduce((total, e) => {
        return total + e.total
      }, 0)
    setbalance(newbalance)
  }, [income, getex])

  if (!user) {
    return <SignIn></SignIn>
  }

  return (
    <>
      <Incomemodal open={modalforincome} close={setmodalforincome} income={income} setincome={setincome}></Incomemodal>
      <Expensemodal open={modalforexpense} close={setmodalforexpense} expense={getex} setex={setex}></Expensemodal>
      <main className="container max-w-2xl px-6 mx-auto">
        <section>
          <small className="text-white text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
        </section>
        <section className="flex items-center gap-2 py-3">
          <button className="text-emerald-500 rounded-md bg-lime-200 p-2 transition-all duration-100 hover:scale-110" onClick={() => setmodalforexpense(true)}>
            +Expenses
          </button>
          <button className="text-emerald-500 rounded-md border border-lime-200 p-2 transition-all duration-100 hover:scale-110" onClick={() => setmodalforincome(true)}>
            +Income
          </button>
        </section>
        <section className="py-6">
          <h3>My Expenses</h3>
          <div className="flex flex-col gap-4 mt-6">
            {getex.map((item) => {
              return (
                <Items key={item.id} expense={item} setex={setex}></Items>
              )
            })}
          </div>
        </section>
        <section className="py-6">
          <h3 className="text-2xl">Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut data={{
              labels: getex.map(item => item.title),
              datasets: [
                {
                  label: "Expenses",
                  data: getex.map(item => item.total),
                  backgroundColor: getex.map(item => item.color),
                  borderWidth: 2
                }
              ]
            }}></Doughnut>
          </div>
        </section>
      </main>
    </>
  )
}
