'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Plus, Minus, Loader2 } from 'lucide-react'
import { readJSON, appendToJSON } from "@/lib/csvHandler"
import { Header } from '@/components/Header'
import { ButtonProps } from "@/components/ui/button"

interface Branch {
  name: string;
  address: string;
}

interface NewCustomer {
  name: string;
  ltd: string;
  address: string;
  email: string;
  tel1: string;
  internetProvider: string;
  authName: string;
  authEmail: string;
  authMobile: string;
  authId: string;
  businessType: string;
  contactName: string;
  contactMobile: string;
  contactEmail: string;
  notes: string;
  isMultiBranch: boolean;
  branches: Branch[];
}

interface Customer {
  id: string;
  name: string;
  // ... other customer fields
}

interface Product {
  id: string;
  name: string;
  // ... other product fields
}

interface OrderItem {
  productId: string;
  quantity: number;
}

interface ValidationErrors {
  [key: `branchName-${number}`]: string;
  [key: `branchAddress-${number}`]: string;
  [key: `product-${number}`]: string;
  [key: `quantity-${number}`]: string;
  customer?: string;
  name?: string;
  ltd?: string;
  address?: string;
  tel1?: string;
  email?: string;
  authName?: string;
  authMobile?: string;
  authEmail?: string;
  fetch?: string;
  submit?: string;
}

type ButtonVariants = React.ComponentProps<typeof Button>

interface FormElements extends HTMLFormControlsCollection {
  customer: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

interface OrderFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function NewOrder() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [newCustomer, setNewCustomer] = useState<NewCustomer>({
    name: '',
    ltd: '',
    address: '',
    email: '',
    tel1: '',
    internetProvider: '',
    authName: '',
    authEmail: '',
    authMobile: '',
    authId: '',
    businessType: '',
    contactName: '',
    contactMobile: '',
    contactEmail: '',
    notes: '',
    isMultiBranch: false,
    branches: [{ name: '', address: '' }]
  })
  const [selectedBranch, setSelectedBranch] = useState(0)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ productId: '', quantity: 1 }])
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await readJSON("companies.json") as Customer[]
        const productsData = await readJSON("products.json") as Product[]
        setCustomers(companiesData)
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrors({ fetch: 'Failed to load customer and product data' })
      }
    }
    fetchData()
  }, [])

  const addBranch = () => {
    setNewCustomer({
      ...newCustomer,
      branches: [...newCustomer.branches, { name: '', address: '' }]
    })
  }

  const updateBranch = (index: number, field: keyof Branch, value: string) => {
    const updatedBranches = newCustomer.branches.map((branch, i) => 
      i === index ? { ...branch, [field]: value } : branch
    )
    setNewCustomer({ ...newCustomer, branches: updatedBranches })
  }

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }])
  }

  const removeOrderItem = (index: number) => {
    const newOrderItems = orderItems.filter((_, i) => i !== index)
    setOrderItems(newOrderItems)
  }

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newOrderItems = [...orderItems]
    newOrderItems[index] = {
      ...newOrderItems[index],
      [field]: value
    }
    setOrderItems(newOrderItems)
  }

  const validateStep = () => {
    const newErrors: ValidationErrors = {}
    if (step === 1) {
      if (!selectedCustomer && !newCustomer.name) {
        newErrors.customer = 'יש לבחור לקוח קיים או להזין פרטי לקוח חדש'
      }
      if (newCustomer.name) {
        if (!newCustomer.name) newErrors.name = 'יש להזין שם עסק'
        if (!newCustomer.ltd) newErrors.ltd = 'יש להזין ח.פ. או ע.מ'
        if (!newCustomer.address) newErrors.address = 'יש להזין כתובת'
        if (!newCustomer.tel1) newErrors.tel1 = 'יש להזין מספר טלפון'
        if (!newCustomer.email) newErrors.email = 'יש להזין כתובת אימייל'
        if (!newCustomer.authName) newErrors.authName = 'יש להזין שם מורשה חתימה'
        if (!newCustomer.authMobile) newErrors.authMobile = 'יש להזין נייד מורשה חתימה'
        if (!newCustomer.authEmail) newErrors.authEmail = 'יש להזין אימייל מורשה חתימה'
      }
    } else if (step === 2 && newCustomer.isMultiBranch) {
      newCustomer.branches.forEach((branch, index) => {
        if (!branch.name) newErrors[`branchName-${index}`] = 'יש להזין שם סניף'
        if (!branch.address) newErrors[`branchAddress-${index}`] = 'יש להזין כתובת סניף'
      })
    } else if (step === 3) {
      orderItems.forEach((item, index) => {
        if (!item.productId) newErrors[`product-${index}`] = 'יש לבחור מוצר'
        if (item.quantity < 1) newErrors[`quantity-${index}`] = 'הכמות חייבת להיות לפחות 1'
      })
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep()) {
      if (step === 1 && !newCustomer.isMultiBranch) {
        setStep(3)
      } else {
        setStep(step + 1)
      }
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent<OrderFormElement>) => {
    e.preventDefault()
    if (!validateStep()) return

    setIsLoading(true)
    try {
      let customerId = selectedCustomer
      if (!customerId) {
        // Create new customer
        const newCustomerData = {
          ...newCustomer,
          id: Date.now().toString(),
          isMultiBranch: newCustomer.isMultiBranch ? 'yes' : 'no'
        }
        await appendToJSON("companies.json", newCustomerData)
        customerId = newCustomerData.id
      }

      const orderData = {
        customerId,
        branchIndex: newCustomer.isMultiBranch ? selectedBranch : undefined,
        items: orderItems,
        notes,
        date: new Date().toISOString(),
        status: 'new'
      }
      await appendToJSON("orders.json", orderData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating order:', error)
      setErrors({ submit: 'אירעה שגיאה ביצירת ההזמנה. אנא נסה שנית.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header title="הזמנה חדשה" backUrl="/dashboard" />
      <main className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>יצירת הזמנה חדשה - שלב {step} מתוך 3</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>בחר לקוח קיים או צור לקוח חדש</Label>
                    <RadioGroup defaultValue="existing" onValueChange={(value: string) => {
                      setSelectedCustomer(value)
                      if (value) {
                        setNewCustomer({
                          name: '',
                          ltd: '',
                          address: '',
                          email: '',
                          tel1: '',
                          internetProvider: '',
                          authName: '',
                          authEmail: '',
                          authMobile: '',
                          authId: '',
                          businessType: '',
                          contactName: '',
                          contactMobile: '',
                          contactEmail: '',
                          notes: '',
                          isMultiBranch: false,
                          branches: [{ name: '', address: '' }]
                        })
                      }
                    }}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="existing" id="existing" />
                        <Label htmlFor="existing">לקוח קיים</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new">לקוח חדש</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {selectedCustomer === 'existing' && (
                    <div className="space-y-2">
                      <Label htmlFor="customer">בחר לקוח</Label>
                      <Select onValueChange={(value: string) => setSelectedCustomer(value)}>
                        <SelectTrigger id="customer">
                          <SelectValue placeholder="בחר לקוח" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedCustomer === 'new' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="customerName">שם העסק</Label>
                        <Input
                          id="customerName"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerLtd">ח.פ. או ע.מ</Label>
                        <Input
                          id="customerLtd"
                          value={newCustomer.ltd}
                          onChange={(e) => setNewCustomer({ ...newCustomer, ltd: e.target.value })}
                        />
                        {errors.ltd && <p className="text-red-500 text-sm">{errors.ltd}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerAddress">כתובת מלאה</Label>
                        <Input
                          id="customerAddress"
                          value={newCustomer.address}
                          onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">טלפון</Label>
                        <Input
                          id="customerPhone"
                          value={newCustomer.tel1}
                          onChange={(e) => setNewCustomer({ ...newCustomer, tel1: e.target.value })}
                        />
                        {errors.tel1 && <p className="text-red-500 text-sm">{errors.tel1}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">מייל בית העסק לחשבוניות</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="internetProvider">ספק אינטרנט</Label>
                        <Input
                          id="internetProvider"
                          value={newCustomer.internetProvider}
                          onChange={(e) => setNewCustomer({ ...newCustomer, internetProvider: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="authName">שם מורשה חתימה</Label>
                        <Input
                          id="authName"
                          value={newCustomer.authName}
                          onChange={(e) => setNewCustomer({ ...newCustomer, authName: e.target.value })}
                        />
                        {errors.authName && <p className="text-red-500 text-sm">{errors.authName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="authMobile">נייד מורשה חתימה</Label>
                        <Input
                          id="authMobile"
                          value={newCustomer.authMobile}
                          onChange={(e) => setNewCustomer({ ...newCustomer, authMobile: e.target.value })}
                        />
                        {errors.authMobile && <p className="text-red-500 text-sm">{errors.authMobile}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="authEmail">מייל מורשה חתימה</Label>
                        <Input
                          id="authEmail"
                          type="email"
                          value={newCustomer.authEmail}
                          onChange={(e) => setNewCustomer({ ...newCustomer, authEmail: e.target.value })}
                        />
                        {errors.authEmail && <p className="text-red-500 text-sm">{errors.authEmail}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="authId">ת.ז. מורשה חתימה</Label>
                        <Input
                          id="authId"
                          value={newCustomer.authId}
                          onChange={(e) => setNewCustomer({ ...newCustomer, authId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessType">ע.מ. או חברה בע"מ</Label>
                        <Select onValueChange={(value) => setNewCustomer({ ...newCustomer, businessType: value })}>
                          <SelectTrigger id="businessType">
                            <SelectValue placeholder="בחר סוג עסק" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="עוסק מורשה">עוסק מורשה</SelectItem>
                            <SelectItem value="חברה בע״מ">חברה בע״מ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactName">שם ומשפחה - איש קשר</Label>
                        <Input
                          id="contactName"
                          value={newCustomer.contactName}
                          onChange={(e) => setNewCustomer({ ...newCustomer, contactName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactMobile">נייד איש קשר</Label>
                        <Input
                          id="contactMobile"
                          value={newCustomer.contactMobile}
                          onChange={(e) => setNewCustomer({ ...newCustomer, contactMobile: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">מייל איש קשר</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={newCustomer.contactEmail}
                          onChange={(e) => setNewCustomer({ ...newCustomer, contactEmail: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">הערות ללקוח</Label>
                        <Textarea
                          id="notes"
                          value={newCustomer.notes}
                          onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isMultiBranch"
                          checked={newCustomer.isMultiBranch}
                          onCheckedChange={(checked) => setNewCustomer({ ...newCustomer, isMultiBranch: checked })}
                        />
                        <Label htmlFor="isMultiBranch">לקוח מרובה סניפים</Label>
                      </div>
                    </>
                  )}
                </>
              )}

              {step === 2 && newCustomer.isMultiBranch && (
                <>
                  <h3 className="text-lg font-semibold">פרטי סניפים</h3>
                  {newCustomer.branches.map((branch, index) => (
                    <div key={index} className="space-y-2 border p-4 rounded">
                      <Label htmlFor={`branchName-${index}`}>שם הסניף</Label>
                      <Input
                        id={`branchName-${index}`}
                        value={branch.name}
                        onChange={(e) => updateBranch(index, 'name', e.target.value)}
                      />
                      {errors[`branchName-${index}`] && <p className="text-red-500 text-sm">{errors[`branchName-${index}`]}</p>}
                      
                      <Label htmlFor={`branchAddress-${index}`}>כתובת הסניף</Label>
                      <Input
                        id={`branchAddress-${index}`}
                        value={branch.address}
                        onChange={(e) => updateBranch(index, 'address', e.target.value)}
                      />
                      {errors[`branchAddress-${index}`] && <p className="text-red-500 text-sm">{errors[`branchAddress-${index}`]}</p>}
                    </div>
                  ))}
                  <Button type="button" onClick={addBranch}>
                    <Plus className="h-4 w-4 mr-2" /> הוסף סניף
                  </Button>
                </>
              )}

              {step === 3 && (
                <>
                  {newCustomer.isMultiBranch && (
                    <div className="space-y-2">
                      <Label htmlFor="branch">בחר סניף להתקנה</Label>
                      <Select onValueChange={(value) => setSelectedBranch(parseInt(value))}>
                        <SelectTrigger id="branch">
                          <SelectValue placeholder="בחר סניף" />
                        </SelectTrigger>
                        <SelectContent>
                          {newCustomer.branches.map((branch, index) => (
                            <SelectItem key={index} value={index.toString()}>{branch.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {orderItems.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`product-${index}`}>מוצר {index + 1}</Label>
                        {index > 0 && (
                          <Button type="button" onClick={() => removeOrderItem(index)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Select onValueChange={(value) => updateOrderItem(index, 'productId', value)}>
                          <SelectTrigger id={`product-${index}`}>
                            <SelectValue placeholder="בחר מוצר" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="כמות"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                          className="w-24"
                        />
                      </div>
                      {errors[`product-${index}`] && <p className="text-red-500 text-sm">{errors[`product-${index}`]}</p>}
                      {errors[`quantity-${index}`] && <p className="text-red-500 text-sm">{errors[`quantity-${index}`]}</p>}
                    </div>
                  ))}

                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={addOrderItem}
                  >
                    <Plus className="h-4 w-4 mr-2" /> הוסף מוצר
                  </button>

                  <div className="space-y-2">
                    <Label htmlFor="notes">הערות</Label>
                    <Textarea
                      id="notes"
                      placeholder="הערות נוספות להזמנה"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button 
                type="button"
                onClick={handlePrevStep}
              >
                חזור
              </Button>
            )}
            {step < 3 ? (
              <Button 
                type="button"
                onClick={handleNextStep}
              >
                המשך
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    מעבד...
                  </>
                ) : (
                  'צור הזמנה'
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
      {errors.submit && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{errors.submit}</p>
        </div>
      )}
    </div>
  )
}