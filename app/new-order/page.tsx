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
import { Plus, Minus, Loader2, ArrowRight } from 'lucide-react'
import { readJSON, appendToJSON } from "@/lib/csvHandler"
import { Header } from '@/components/Header'
import { ButtonProps } from "@/components/ui/button"
import { CustomerSelect } from "@/components/customer-select"
 import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"

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
  Name: string;
  Price: string;
  price36: string;
  price48: string;
  Description: string;
  "Product Type": string;
  "Product Category": string;
  "HOT Price base": string;
}

interface OrderItem {
  productId: string;
  quantity: number;
}

interface ValidationErrors {
  [key: string]: string;
}

type ButtonVariants = React.ComponentProps<typeof Button>

interface FormElements extends HTMLFormControlsCollection {
  customer: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

type PaymentPlan = 'one-time' | '36' | '48';

interface OrderFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

interface Company {
  id?: string;
  "שם העסק": string;
  "ח.פ. או ע.מ": string;
  "ע.מ. או חברה בעמ": string;
  "כתובת מלאה": string;
  "טלפון": string;
  "מייל בית העסק לחשבוניות": string;
  "שם מורשה": string;
  "נייד מורשה": string;
  "ספק אינטרנט": string;
  branches?: Branch[];
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
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{ productId: '', quantity: 1 }])
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [customerType, setCustomerType] = useState<'existing' | 'new'>('existing')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('one-time')
  const [isNewBranch, setIsNewBranch] = useState(false)
  const [newBranchAddress, setNewBranchAddress] = useState("")
  const [branchCount, setBranchCount] = useState(1)
  const [isMultiBranch, setIsMultiBranch] = useState(false)
  const [customerId, setCustomerId] = useState<string>('')

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

  const updateOrderItem = (index: number, field: keyof OrderItem, value: any) => {
    const newOrderItems = [...orderItems]
    newOrderItems[index] = {
      ...newOrderItems[index],
      [field]: value
    }
    setOrderItems(newOrderItems)
    console.log('Updated order items:', newOrderItems)
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
        if (!branch.name) {
          newErrors[`branchName-${index}`] = 'שם הסניף הוא שדה חובה'
        }
        if (!branch.address) {
          newErrors[`branchAddress-${index}`] = 'כתובת הסניף היא שדה חובה'
        }
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
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  }

  const handleSubmit = async (e: React.FormEvent<OrderFormElement>) => {
    e.preventDefault();
    console.log('Form submitted', { orderItems, paymentPlan });

    if (!validateStep()) {
      console.log('Validation failed', errors);
      return;
    }

    if (orderItems.some(item => !item.productId)) {
      setErrors({ submit: 'יש לבחור מוצרים להזמנה' });
      return;
    }

    setIsLoading(true);
    try {
      let customerId = selectedCustomer;
      if (customerType === 'new') {
        const newCustomerData = {
          ...newCustomer,
          id: Date.now().toString(),
        };
        console.log('Creating new customer:', newCustomerData); // Debug log
        await appendToJSON("companies.json", newCustomerData);
        customerId = newCustomerData.id;
      }

      const calculateTotals = (items: OrderItem[]) => {
        const totals = {
          OTC: 0,
          Service: 0,
          OneTime: 0
        };

        items.forEach(item => {
          const product = products.find(p => p.Name === item.productId);
          if (product) {
            const price = parseFloat(getProductPrice(product, paymentPlan));
            const total = price * item.quantity;

            switch (product["Product Category"]) {
              case "OTC":
                totals.OTC += total;
                break;
              case "Service":
                totals.Service += total;
                break;
              case "One time":
                totals.OneTime += total;
                break;
            }
          }
        });

        return totals;
      };

      const orderData = {
        id: Date.now().toString(),
        customerId: customerType === 'existing' ? selectedCompany?.["ח.פ. או ע.מ"] : customerId,
        customerName: customerType === 'existing' ? selectedCompany?.["שם העסק"] : newCustomer.name,
        branch: isNewBranch ? {
          name: `סניף חדש - ${new Date().toISOString().split('T')[0]}`,
          address: newBranchAddress
        } : {
          name: selectedBranch ? `סניף - ${selectedBranch}` : 'סניף ראשי',
          address: selectedBranch || selectedCompany?.["כתובת מלאה"]
        },
        paymentPlan,
        items: orderItems.map(item => ({
          ...item,
          price: getProductPrice(products.find(p => p.Name === item.productId)!, paymentPlan)
        })),
        totals: calculateTotals(orderItems),
        notes,
        date: new Date().toISOString(),
        status: 'pending',
        stage: 'new',
        createdAt: new Date().toISOString()
      };

      console.log('Submitting order data:', orderData);

      // If it's a new branch, update the company record
      if (customerType === 'existing' && isNewBranch && selectedCompany) {
        const updatedCompany = {
          ...(selectedCompany || {}),
          branches: (selectedCompany.branches || []).concat({
            name: `סניף חדש - ${new Date().toISOString().split('T')[0]}`,
            address: newBranchAddress
          })
        };

        await supabase
          .from('companies')
          .update(updatedCompany)
          .eq('ח.פ. או ע.מ', selectedCompany["ח.פ. או ע.מ"]);
      }

      await appendToJSON("orders.json", orderData);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        router.push('/active-orders');
      }, 2000);
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors({ submit: 'אירעה שגיאה בשמירת ההזמנה' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = (searchTerm: string) => {
    return products.filter(product => 
      product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product["Product Type"].toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const getProductPrice = (product: Product, plan: PaymentPlan) => {
    switch (plan) {
      case '36':
        return product.price36;
      case '48':
        return product.price48;
      default:
        return product.Price;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            חזור לדף הבית
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>יצירת הזמנה חדשה - שלב {step} מתוך 3</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="orderForm" onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>בחר לקוח קיים או צור לקוח חדש</Label>
                    <RadioGroup
                      defaultValue="existing"
                      onValueChange={(value) => setCustomerType(value as 'existing' | 'new')}
                      className="mb-6"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="existing" id="existing" />
                        <Label htmlFor="existing">לקוח קיים</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new">לקוח חדש</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {customerType === 'existing' && (
                    <div className="space-y-4">
                      <CustomerSelect 
                        onSelect={(company) => setSelectedCompany(company)} 
                      />
                      
                      {selectedCompany && (
                        <div className="p-4 border rounded-lg bg-muted">
                          <h3 className="font-semibold mb-2">פרטי לקוח:</h3>
                          <div className="space-y-1">
                            <p>שם: {selectedCompany["שם העסק"]}</p>
                            <p>ח.פ: {selectedCompany["ח.פ. או ע.מ"]}</p>
                            <p>כתובת: {selectedCompany["כתובת מלאה"]}</p>
                            <p>טלפון: {selectedCompany["טלפון"]}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {customerType === 'new' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">שם העסק</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ltd">ח.פ. או ע.מ</Label>
                        <Input
                          id="ltd"
                          value={newCustomer.ltd}
                          onChange={(e) => setNewCustomer({ ...newCustomer, ltd: e.target.value })}
                        />
                        {errors.ltd && <p className="text-red-500 text-sm">{errors.ltd}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">כתובת מלאה</Label>
                        <Input
                          id="address"
                          value={newCustomer.address}
                          onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tel1">טלפון</Label>
                        <Input
                          id="tel1"
                          value={newCustomer.tel1}
                          onChange={(e) => setNewCustomer({ ...newCustomer, tel1: e.target.value })}
                        />
                        {errors.tel1 && <p className="text-red-500 text-sm">{errors.tel1}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">מייל בית העסק לחשבוניות</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="internetProvider">ספק אינטרנט</Label>
                        <Select 
                          onValueChange={(value) => setNewCustomer({ ...newCustomer, internetProvider: value })}
                        >
                          <SelectTrigger id="internetProvider">
                            <SelectValue placeholder="בחר ספק אינטרנט" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HOT">HOT</SelectItem>
                            <SelectItem value="בזק">בזק</SelectItem>
                            <SelectItem value="פרטנר">פרטנר</SelectItem>
                            <SelectItem value="סלקום">סלקום</SelectItem>
                            <SelectItem value="אחר">אחר</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessType">סוג עסק</Label>
                        <Select 
                          onValueChange={(value) => setNewCustomer({ ...newCustomer, businessType: value })}
                        >
                          <SelectTrigger id="businessType">
                            <SelectValue placeholder="בחר סוג עסק" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="עוסק מורשה">עוסק מורשה</SelectItem>
                            <SelectItem value="חברה בע״מ">חברה בע״מ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id="isMultiBranch"
                            checked={isMultiBranch}
                            onCheckedChange={(checked) => {
                              setIsMultiBranch(checked)
                              if (!checked) {
                                setBranchCount(1)
                                setNewCustomer(prev => ({
                                  ...prev,
                                  branches: [{ name: '', address: '' }]
                                }))
                              }
                            }}
                          />
                          <Label htmlFor="isMultiBranch">האם יש מספר סניפים?</Label>
                        </div>

                        {isMultiBranch && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Label htmlFor="branchCount">מספר סניפים</Label>
                              <Input
                                id="branchCount"
                                type="number"
                                min="1"
                                max="10"
                                value={branchCount}
                                onChange={(e) => {
                                  const count = parseInt(e.target.value)
                                  setBranchCount(count)
                                  setNewCustomer(prev => ({
                                    ...prev,
                                    branches: Array(count).fill(0).map((_, i) => 
                                      prev.branches[i] || { name: '', address: '' }
                                    )
                                  }))
                                }}
                                className="w-24"
                              />
                            </div>

                            {Array(branchCount).fill(0).map((_, index) => (
                              <div key={index} className="p-4 border rounded-lg space-y-4">
                                <h3 className="font-medium">סניף {index + 1}</h3>
                                
                                <div className="space-y-2">
                                  <Label htmlFor={`branchName-${index}`}>שם הסניף</Label>
                                  <Input
                                    id={`branchName-${index}`}
                                    value={newCustomer.branches[index]?.name || ''}
                                    onChange={(e) => {
                                      const updatedBranches = [...newCustomer.branches]
                                      updatedBranches[index] = {
                                        ...updatedBranches[index],
                                        name: e.target.value
                                      }
                                      setNewCustomer(prev => ({
                                        ...prev,
                                        branches: updatedBranches
                                      }))
                                    }}
                                    placeholder="שם הסניף"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`branchAddress-${index}`}>כתובת הסניף</Label>
                                  <Input
                                    id={`branchAddress-${index}`}
                                    value={newCustomer.branches[index]?.address || ''}
                                    onChange={(e) => {
                                      const updatedBranches = [...newCustomer.branches]
                                      updatedBranches[index] = {
                                        ...updatedBranches[index],
                                        address: e.target.value
                                      }
                                      setNewCustomer(prev => ({
                                        ...prev,
                                        branches: updatedBranches
                                      }))
                                    }}
                                    placeholder="כתובת מלאה של הסניף"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">הערות</Label>
                        <Textarea
                          id="notes"
                          value={newCustomer.notes}
                          onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {customerType === 'existing' && selectedCompany && (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted">
                        <h3 className="font-semibold mb-2">פרטי לקוח:</h3>
                        <div className="space-y-1">
                          <p>שם: {selectedCompany["שם העסק"]}</p>
                          <p>ח.פ: {selectedCompany["ח.פ. או ע.מ"]}</p>
                          <p>כתובת: {selectedCompany["כתובת מלאה"]}</p>
                          <p>טלפון: {selectedCompany["טלפון"]}</p>
                        </div>
                      </div>

                      <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                              id="isNewBranch"
                              checked={isNewBranch}
                              onCheckedChange={(checked) => {
                                setIsNewBranch(checked)
                                if (!checked) {
                                  setNewBranchAddress("")
                                  setBranchCount(1)
                                }
                              }}
                            />
                            <Label htmlFor="isNewBranch">האם מדובר בסניף חדש?</Label>
                          </div>
                          
                          {isNewBranch && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setIsNewBranch(false)
                                setNewBranchAddress("")
                                setBranchCount(1)
                              }}
                            >
                              ביטול
                            </Button>
                          )}
                        </div>

                        {isNewBranch && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Label htmlFor="branchCount">מספר סניפים חדשים</Label>
                              <Input
                                id="branchCount"
                                type="number"
                                min="1"
                                max="10"
                                value={branchCount}
                                onChange={(e) => setBranchCount(Math.max(1, parseInt(e.target.value)))}
                                className="w-24"
                              />
                            </div>

                            {Array(branchCount).fill(0).map((_, index) => (
                              <div key={index} className="p-4 border rounded-lg space-y-2">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium">סניף חדש {index + 1}</h3>
                                  {index > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setBranchCount(prev => prev - 1)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <Input
                                  value={newBranchAddress}
                                  onChange={(e) => setNewBranchAddress(e.target.value)}
                                  placeholder="הזן את כתובת הסניף החדש"
                                />
                              </div>
                            ))}

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setBranchCount(prev => Math.min(prev + 1, 10))}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              הוסף סניף נוסף
                            </Button>
                          </div>
                        )}

                        {!isNewBranch && selectedCompany.branches && selectedCompany.branches.length > 0 && (
                          <div className="space-y-2">
                            <Label htmlFor="existingBranch">בחר סניף קיים</Label>
                            <Select 
                              value={selectedBranch} 
                              onValueChange={setSelectedBranch}
                            >
                              <SelectTrigger id="existingBranch">
                                <SelectValue placeholder="בחר סניף" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={selectedCompany["כתובת מלאה"]}>
                                  סניף ראשי - {selectedCompany["כתובת מלאה"]}
                                </SelectItem>
                                {selectedCompany.branches.map((branch, index) => (
                                  <SelectItem key={index} value={branch.address}>
                                    {branch.name} - {branch.address}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 space-y-2">
                        <Label>בחר תכנית תשלומים</Label>
                        <RadioGroup
                          value={paymentPlan}
                          onValueChange={(value) => setPaymentPlan(value as PaymentPlan)}
                          className="grid grid-cols-3 gap-4"
                        >
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="one-time" id="one-time" />
                            <Label htmlFor="one-time">תשלום אחד</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="36" id="36-payments" />
                            <Label htmlFor="36-payments">36 תשלומים</Label>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="48" id="48-payments" />
                            <Label htmlFor="48-payments">48 תשלומים</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
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
                      <Select onValueChange={(value) => setSelectedBranch(value)}>
                        <SelectTrigger id="branch">
                          <SelectValue placeholder="בחר סניף" />
                        </SelectTrigger>
                        <SelectContent>
                          {newCustomer.branches.map((branch, index) => (
                            <SelectItem key={index} value={branch.address}>{branch.name} - {branch.address}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {orderItems.map((item, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`product-${index}`} className="text-lg font-medium">
                          מוצר {index + 1}
                        </Label>
                        {index > 0 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeOrderItem(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-col md:flex-row gap-2">
                        <div className="flex-1">
                          <Select 
                            onValueChange={(value) => updateOrderItem(index, 'productId', value)}
                            value={item.productId}
                          >
                            <SelectTrigger id={`product-${index}`} className="flex-1">
                            <SelectValue placeholder="בחר מוצר" />
                          </SelectTrigger>
                            <SelectContent className="w-[300px] md:w-[500px]">
                              <div className="p-2 border-b">
                                <Input
                                  placeholder="חיפוש מוצר..."
                                  value={productSearch}
                                  onChange={(e) => setProductSearch(e.target.value)}
                                  className="w-full"
                                />
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                {filteredProducts(productSearch).map((product) => (
                                  <SelectItem 
                                    key={product.Name} 
                                    value={product.Name}
                                    className="py-3"
                                  >
                                    <div className="flex flex-col w-full gap-1">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1 ml-4">
                                          <div className="font-medium truncate">{product.Name}</div>
                                          <div className="text-sm text-muted-foreground">
                                            {product["Product Type"]} | {product["Product Category"]}
                                          </div>
                                        </div>
                                        <div className="text-right whitespace-nowrap">
                                          <div className="font-medium">
                                            ₪{getProductPrice(product, paymentPlan)}
                                            {paymentPlan !== 'one-time' && product["Product Category"] === "OTC" && 
                                              ` × ${paymentPlan}`
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </div>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="כמות"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                            className="w-full md:w-24"
                          />
                        </div>
                        {errors[`product-${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`product-${index}`]}</p>
                        )}
                        {errors[`quantity-${index}`] && (
                          <p className="text-red-500 text-sm">{errors[`quantity-${index}`]}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={addOrderItem}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" /> הוסף מוצר
                  </Button>
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
                form="orderForm"
                disabled={isLoading || orderItems.some(item => !item.productId)}
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

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-xl font-bold mb-2">ההזמנה נשלחה בהצלחה!</h3>
            <p className="text-gray-600">מעביר אותך לדף ההזמנות...</p>
          </div>
        </div>
      )}
    </div>
  );
}
